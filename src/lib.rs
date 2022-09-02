#![allow(clippy::not_unsafe_ptr_arg_deref)]

pub use std::io;

use anyhow::{anyhow, Result};
use deno_bindgen::deno_bindgen;
use image::{ImageOutputFormat, Rgba};
use silicon::formatter::ImageFormatterBuilder;
use silicon::utils::{init_syntect, Background, ShadowAdder, ToRgba};
use syntect::easy::HighlightLines;
use syntect::util::LinesWithEndings;

#[deno_bindgen]
pub enum SiliconResult {
    FontList { data: Vec<String> },
    ThemeList { data: Vec<String> },
    Image { data: String },
    Error { error: String },
}

#[deno_bindgen]
pub fn font_list() -> SiliconResult {
    let source = font_kit::source::SystemSource::new();
    match source.all_families() {
        Ok(fonts) => SiliconResult::FontList { data: fonts },
        Err(err) => SiliconResult::Error {
            error: err.to_string(),
        },
    }
}

#[deno_bindgen]
pub fn theme_list() -> SiliconResult {
    let (_, ts) = init_syntect();
    let thems: Vec<String> = ts.themes.keys().cloned().collect();
    SiliconResult::ThemeList { data: thems }
}

#[deno_bindgen]
pub struct Options {
    // Source code
    code: String,
    // full name ("Rust") or file extension ("rs")
    language: String,
    // Hide the line number
    no_line_number: bool,
    // Don't round the corner
    no_round_corner: bool,
    // Hide the window controls
    no_window_controls: bool,
    // Background color of the image [default: #aaaaff]
    background_color: String,
    // The fallback font list. eg. 'Hack; SimSun=31'
    font: String,
    // Lines to high light. rg. '1-3; 4'
    highlight_lines: String,
    // Line number offset [default: 1]
    line_offset: u32,
    // Pad between lines [default: 2]
    line_pad: u32,
    // Pad horiz [default: 80]
    pad_horiz: u32,
    // Pad vert [default: 100]
    pad_vert: u32,
    // Blur radius of the shadow. (set it to 0 to hide shadow) [default: 0]
    shadow_blur_radius: f32,
    // Color of shadow [default: #555555]
    shadow_color: String,
    // Shadow's offset in X axis [default: 0]
    shadow_offset_x: i32,
    // Shadow's offset in Y axis [default: 0]
    shadow_offset_y: i32,
    // Tab width [default: 4]
    tab_width: u8,
    // The syntax highlight theme. It can be a theme name or path to a .tmTheme file [default: Dracula]
    theme: String,
}

fn parse_font(s: String) -> Vec<(String, f32)> {
    let mut result = vec![];
    if s.is_empty() {
        return result;
    }
    for font in s.split(';') {
        let tmp = font.split('=').collect::<Vec<_>>();
        let font_name = tmp[0].to_owned();
        let font_size = tmp
            .get(1)
            .map(|s| s.parse::<f32>().unwrap())
            .unwrap_or(26.0);
        result.push((font_name, font_size));
    }
    result
}

fn parse_line_range(s: String) -> Result<Vec<u32>> {
    let mut result = vec![];
    for range in s.split(';') {
        let range: Vec<u32> = range
            .split('-')
            .map(|s| s.parse::<u32>())
            .collect::<Result<Vec<_>, _>>()?;
        if range.len() == 1 {
            result.push(range[0])
        } else {
            for i in range[0]..=range[1] {
                result.push(i);
            }
        }
    }
    Ok(result)
}

fn parse_color(s: String) -> Result<Rgba<u8>> {
    let color = s.to_rgba().map_err(|x| anyhow!("invalid color: {}", x))?;
    Ok(color)
}

fn run(opts: Options) -> Result<Vec<u8>> {
    let (ps, ts) = init_syntect();
    let code = opts.code;

    let syntax = ps
        .find_syntax_by_token(opts.language.as_str())
        .ok_or_else(|| anyhow!("unsupported language"))?;

    let theme = &ts
        .themes
        .get(&opts.theme)
        .ok_or_else(|| anyhow!("unsupported theme"))?;

    let mut h = HighlightLines::new(syntax, theme);
    let highlight = LinesWithEndings::from(&code)
        .map(|line| h.highlight(line, &ps))
        .collect::<Vec<_>>();

    let mut highlight_lines = Vec::<u32>::new();
    if !opts.highlight_lines.is_empty() {
        highlight_lines = parse_line_range(opts.highlight_lines)?;
    }

    let background = parse_color(opts.background_color)?;
    let shadow = parse_color(opts.shadow_color)?;

    let shadow_adder = ShadowAdder::new()
        .background(Background::Solid(background))
        .shadow_color(shadow)
        .blur_radius(opts.shadow_blur_radius)
        .pad_horiz(opts.pad_horiz)
        .pad_vert(opts.pad_vert)
        .offset_x(opts.shadow_offset_x)
        .offset_y(opts.shadow_offset_y);

    let mut formatter = ImageFormatterBuilder::new()
        .line_pad(opts.line_pad)
        .window_controls(!opts.no_window_controls)
        .line_number(!opts.no_line_number)
        .font(parse_font(opts.font))
        .round_corner(!opts.no_round_corner)
        .shadow_adder(shadow_adder)
        .tab_width(opts.tab_width)
        .highlight_lines(highlight_lines)
        .line_offset(opts.line_offset)
        .build()?;

    let image = formatter.format(&highlight, theme);

    let mut out = io::Cursor::new(Vec::new());
    image.write_to(&mut out, ImageOutputFormat::Png)?;

    let result = out.get_ref().to_vec();
    Ok(result)
}

#[deno_bindgen]
pub fn generate(opts: Options) -> SiliconResult {
    match run(opts) {
        Ok(raw_data) => {
            let b64 = base64::encode(raw_data.as_slice());
            SiliconResult::Image { data: b64 }
        }
        Err(err) => SiliconResult::Error {
            error: err.to_string(),
        },
    }
}

#[cfg(test)]
mod tests {
    use std::{fs::File, io::Read, path::Path};

    use super::*;

    fn assert_image(raw: Vec<u8>) {
        let png_header: Vec<u8> = vec![0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        let raw_header = &raw[..8];
        assert_eq!(raw_header, png_header);
    }

    #[test]
    fn test_run() {
        let mut source = File::open(Path::new("testdata/main.rs")).unwrap();
        let mut contents = String::new();
        source.read_to_string(&mut contents).unwrap();

        let opts = Options {
            code: contents,
            language: "rs".into(),
            no_line_number: true,
            no_round_corner: false,
            no_window_controls: true,
            background_color: "#CCCCCC".into(),
            font: "".into(),
            highlight_lines: "5-7".into(),
            line_offset: 1,
            line_pad: 2,
            pad_horiz: 50,
            pad_vert: 50,
            shadow_blur_radius: 10.5,
            shadow_offset_x: 10,
            shadow_offset_y: 10,
            shadow_color: "#003399".into(),
            tab_width: 10,
            theme: "Solarized (dark)".into(),
        };

        let got = run(opts).unwrap();
        assert_image(got);
    }
}
