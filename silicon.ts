import {
  font_list,
  generate as generate_,
  Options as Options_,
  theme_list,
} from "./bindings/bindings.ts";
import { base64, is } from "./deps.ts";

const isError = is.ObjectOf({
  Error: is.ObjectOf({
    error: is.String,
  }),
});

const isFontList = is.ObjectOf({
  FontList: is.ObjectOf({
    data: is.ArrayOf(is.String),
  }),
});

const isThemeList = is.ObjectOf({
  ThemeList: is.ObjectOf({
    data: is.ArrayOf(is.String),
  }),
});

const isImage = is.ObjectOf({
  Image: is.ObjectOf({
    data: is.String,
  }),
});

/**
 * Return available font list
 */
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

/**
 * Return available theme list
 */
export function themeList(): string[] {
  const result = theme_list();
  if (isThemeList(result)) {
    return result.ThemeList.data;
  }
  throw new Error(`unexpected result: ${JSON.stringify(result)}`);
}

export type Options = Omit<Options_, "code" | "language">;

const defaultOptions: Options = {
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

/*
 * Generate an image from a code.
 */
export function generate(
  code: string,
  language: string,
  opts: Partial<Options> = {},
): Uint8Array {
  const result = generate_({
    ...defaultOptions,
    ...opts,
    code: code,
    language: language,
  });
  if (isError(result)) {
    throw new Error(`cannot generate image: ${result.Error.error}`);
  }
  if (isImage(result)) {
    return base64.decodeBase64(result.Image.data);
  }
  throw new Error(`unexpected result: ${JSON.stringify(result)}`);
}
