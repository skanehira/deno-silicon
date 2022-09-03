// Auto-generated with deno_bindgen
import { CachePolicy, prepare } from "https://deno.land/x/plug@0.5.2/plug.ts"

function encode(v: string | Uint8Array): Uint8Array {
  if (typeof v !== "string") return v
  return new TextEncoder().encode(v)
}

function decode(v: Uint8Array): string {
  return new TextDecoder().decode(v)
}

function readPointer(v: any): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v as bigint)
  const lengthBe = new Uint8Array(4)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const buf = new Uint8Array(view.getUint32(0))
  ptr.copyInto(buf, 4)
  return buf
}

const url = new URL(
  "https://github.com/skanehira/deno-silicon/releases/download/v0.0.2/",
  import.meta.url,
)
let uri = url.toString()
if (!uri.endsWith("/")) uri += "/"

let darwin: string | { aarch64: string; x86_64: string } = uri
  + "libdeno_silicon.dylib"

if (url.protocol !== "file:") {
  // Assume that remote assets follow naming scheme
  // for each macOS artifact.
  darwin = {
    aarch64: uri + "libdeno_silicon_arm64.dylib",
    x86_64: uri + "libdeno_silicon.dylib",
  }
}

const opts = {
  name: "deno_silicon",
  urls: {
    darwin,
    windows: uri + "deno_silicon.dll",
    linux: uri + "libdeno_silicon.so",
  },
  policy: undefined,
}
const _lib = await prepare(opts, {
  font_list: { parameters: [], result: "pointer", nonblocking: false },
  generate: {
    parameters: ["pointer", "usize"],
    result: "pointer",
    nonblocking: false,
  },
  theme_list: { parameters: [], result: "pointer", nonblocking: false },
})
export type Options = {
  code: string
  language: string
  no_line_number: boolean
  no_round_corner: boolean
  no_window_controls: boolean
  background_color: string
  font: string
  highlight_lines: string
  line_offset: number
  line_pad: number
  pad_horiz: number
  pad_vert: number
  shadow_blur_radius: number
  shadow_color: string
  shadow_offset_x: number
  shadow_offset_y: number
  tab_width: number
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
  let rawResult = _lib.symbols.font_list()
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
export function generate(a0: Options) {
  const a0_buf = encode(JSON.stringify(a0))
  let rawResult = _lib.symbols.generate(a0_buf, a0_buf.byteLength)
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
export function theme_list() {
  let rawResult = _lib.symbols.theme_list()
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as SiliconResult
}
