import {
  font_list,
  theme_list,
  Options,
  generate,
} from "./bindings/bindings.ts";
import { base64, io } from "./deps.ts";

const isError = (x: unknown): x is { Error: { error: string } } => {
  return typeof x == "object" && x !== null && "Error" in x;
};

const isFontList = (x: unknown): x is { FontList: { data: Array<string> } } => {
  return typeof x == "object" && x !== null && "FontList" in x;
};

const isThemeList = (
  x: unknown
): x is { ThemeList: { data: Array<string> } } => {
  return typeof x == "object" && x !== null && "ThemeList" in x;
};

const isImage = (x: unknown): x is { Image: { data: string } } => {
  return typeof x == "object" && x !== null && "Image" in x;
};

export function fontList(): string[] {
  const result = font_list();
  if (isError(result)) {
    throw new Error(`cannot get font list: ${result.Error.error}`);
  }
  if (isFontList(result)) {
    return result.FontList.data;
  }
  throw new Error(`unexpected result: ${JSON.stringify(result)}`);
}

export function themeList(): string[] {
  const result = theme_list();
  if (isThemeList(result)) {
    return result.ThemeList.data;
  }
  throw new Error(`unexpected result: ${JSON.stringify(result)}`);
}

const defaultOptions = {
  code: "",
  language: "",
  font: "",
  highlight_lines: "",
  no_line_number: false,
  no_round_corner: false,
  no_window_controls: false,
  background_color: "#aaaaff",
  line_offset: 1,
  line_pad: 2,
  pad_horiz: 80,
  pad_vert: 100,
  shadow_blur_radius: 0,
  shadow_color: "#555555",
  shadow_offset_x: 0,
  shadow_offset_y: 0,
  tab_width: 4,
  theme: "Solarized (dark)",
};

export type Option = Partial<Omit<Options, "code" | "language">>;

/*
 * Generates image from source code.
 * You can specify several options, such as theme.
 * The options conform to silicon options, see silicon help for details.
 * */
export async function generateImage(
  code: string,
  language: string,
  opts?: Option
): Promise<Deno.Reader> {
  defaultOptions.code = code;
  defaultOptions.language = language;
  const options = { ...defaultOptions, ...opts };
  const result = generate(options);
  if (isError(result)) {
    throw new Error(`cannot generate image: ${result.Error.error}`);
  }
  if (isImage(result)) {
    const data = base64.decode(result.Image.data);
    const buffer = new io.Buffer();
    await buffer.write(data);
    return buffer;
  }
  throw new Error(`unexpected result: ${JSON.stringify(result)}`);
}
