import {
  assertEquals,
  assertNotEquals,
  assertThrows,
  path,
} from "./deps_test.ts";
import { generate, themeList } from "./silicon.ts";

function assertImage(data: Uint8Array) {
  const header = data.slice(0, 8);
  const pngHeader = new Uint8Array([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ]);
  assertEquals(header, pngHeader);
}

Deno.test({
  name: "get theme list",
  fn: () => {
    const got = themeList();
    assertNotEquals(got.length, 0);
  },
});

Deno.test({
  name: "generate image",
  fn: () => {
    const code = `package main

import {
  "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;
    const got = generate(code, "go");
    assertImage(got);
  },
});

Deno.test({
  name: "generate image with options",
  fn: async () => {
    const code = new TextDecoder().decode(
      await Deno.readFile(path.join("testdata", "main.rs")),
    );
    const got = generate(code, "rs", {
      no_line_number: true,
      no_round_corner: false,
      no_window_controls: true,
      background_color: "#CCCCCC",
      highlight_lines: "5-7",
      line_offset: 1,
      line_pad: 2,
      pad_horiz: 50,
      pad_vert: 50,
      shadow_blur_radius: 10.5,
      shadow_offset_x: 10,
      shadow_offset_y: 10,
      shadow_color: "#003399",
      tab_width: 10,
      theme: "Solarized (dark)",
    });
    assertImage(got);
  },
});

Deno.test({
  name: "invalid options",
  fn: () => {
    assertThrows(
      () => {
        generate("", "rs", { theme: "hoge" });
      },
      Error,
      "unsupported theme",
    );

    assertThrows(
      () => {
        generate("", "rs", { background_color: "hoge" });
      },
      Error,
      "cannot generate image: invalid color",
    );

    assertThrows(
      () => {
        generate("", "rs", { highlight_lines: "1;" });
      },
      Error,
      "cannot parse integer from empty string",
    );
  },
});
