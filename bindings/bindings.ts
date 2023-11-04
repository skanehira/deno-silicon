// Auto-generated with deno_bindgen
function encode(v: string | Uint8Array): Uint8Array {
  if (typeof v !== "string") return v
  return new TextEncoder().encode(v)
}

function decode(v: Uint8Array): string {
  return new TextDecoder().decode(v)
}

// deno-lint-ignore no-explicit-any
function readPointer(v: any): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v)
  const lengthBe = new Uint8Array(4)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const buf = new Uint8Array(view.getUint32(0))
  ptr.copyInto(buf, 4)
  return buf
}

const url = new URL("../target/debug", import.meta.url)

let uri = url.pathname
if (!uri.endsWith("/")) uri += "/"

// https://docs.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya#parameters
if (Deno.build.os === "windows") {
  uri = uri.replace(/\//g, "\\")
  // Remove leading slash
  if (uri.startsWith("\\")) {
    uri = uri.slice(1)
  }
}

const { symbols } = Deno.dlopen(
  {
    darwin: uri + "libdeno_silicon.dylib",
    windows: uri + "deno_silicon.dll",
    linux: uri + "libdeno_silicon.so",
    freebsd: uri + "libdeno_silicon.so",
    netbsd: uri + "libdeno_silicon.so",
    aix: uri + "libdeno_silicon.so",
    solaris: uri + "libdeno_silicon.so",
    illumos: uri + "libdeno_silicon.so",
  }[Deno.build.os],
  {
    font_list: { parameters: [], result: "buffer", nonblocking: false },
    generate: {
      parameters: ["buffer", "usize"],
      result: "buffer",
      nonblocking: false,
    },
    theme_list: { parameters: [], result: "buffer", nonblocking: false },
  },
)
export type Options = {
  /**
   * Source code
   */
  code: string
  /**
   * full name ("Rust") or file extension ("rs")
   */
  language: string
  /**
   * Hide the line number
   */
  no_line_number: boolean
  /**
   * Don't round the corner
   */
  no_round_corner: boolean
  /**
   * Hide the window controls
   */
  no_window_controls: boolean
  /**
   * Background color of the image [default: #aaaaff]
   */
  background_color: string
  /**
   * The fallback font list. eg. 'Hack; SimSun=31'
   */
  font: string
  /**
   * Lines to high light. rg. '1-3; 4'
   */
  highlight_lines: string
  /**
   * Line number offset [default: 1]
   */
  line_offset: number
  /**
   * Pad between lines [default: 2]
   */
  line_pad: number
  /**
   * Pad horiz [default: 80]
   */
  pad_horiz: number
  /**
   * Pad vert [default: 100]
   */
  pad_vert: number
  /**
   * Blur radius of the shadow. (set it to 0 to hide shadow) [default: 0]
   */
  shadow_blur_radius: number
  /**
   * Color of shadow [default: #555555]
   */
  shadow_color: string
  /**
   * Shadow's offset in X axis [default: 0]
   */
  shadow_offset_x: number
  /**
   * Shadow's offset in Y axis [default: 0]
   */
  shadow_offset_y: number
  /**
   * Tab width [default: 4]
   */
  tab_width: number
  /**
   * The syntax highlight theme. It can be a theme name or path to a .tmTheme file [default: Dracula]
   */
  theme: string
}
export type SiliconResult =
  | {
    FontList: {
      data: Array<string>
    }
  }
  | {
    ThemeList: {
      data: Array<string>
    }
  }
  | {
    Image: {
      data: string
    }
  }
  | {
    Error: {
      error: string
    }
  }
export function font_list() {
  const rawResult = symbols.font_list()
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
export function generate(a0: Options) {
  const a0_buf = encode(JSON.stringify(a0))

  const rawResult = symbols.generate(a0_buf, a0_buf.byteLength)
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
export function theme_list() {
  const rawResult = symbols.theme_list()
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
