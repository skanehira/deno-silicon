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

const url = new URL(
  "https://github.com/skanehira/deno-silicon/releases/download/v0.0.6/",
  import.meta.url,
)

import { dlopen, FetchOptions } from "https://deno.land/x/plug@1.0.1/mod.ts"
let uri = url.toString()
if (!uri.endsWith("/")) uri += "/"

let darwin: string | { aarch64: string; x86_64: string } = uri

const opts: FetchOptions = {
  name: "deno_silicon",
  url: {
    darwin,
    windows: uri,
    linux: uri,
  },
  suffixes: {
    darwin: {
      aarch64: "_arm64",
    },
  },
  cache: "use",
}
const { symbols } = await dlopen(opts, {
  font_list: { parameters: [], result: "buffer", nonblocking: false },
  generate: {
    parameters: ["buffer", "usize"],
    result: "buffer",
    nonblocking: false,
  },
  theme_list: { parameters: [], result: "buffer", nonblocking: false },
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
