import { themeList, generateImage } from "./mod.ts";
import {
  assertRejects,
  assertEquals,
  assertNotEquals,
  io,
  path,
} from "./deps.ts";

Deno.test({
  name: "get theme list",
  fn: () => {
    const got = themeList();
    assertNotEquals(got.length, 0);
  },
});

Deno.test({
  name: "generate image",
  fn: async () => {
    const code = `package main

import {
  "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;
    const r = await generateImage(code, "go");
    const buffer = new io.Buffer();
    await buffer.readFrom(r);
    const got = buffer.bytes();
    const want = await Deno.readFile(path.join("testdata", "out2.png"));
    assertEquals(got, want);
  },
});

Deno.test({
  name: "generate image with options",
  fn: async () => {
    const code = new TextDecoder().decode(
      await Deno.readFile(path.join("testdata", "main.rs"))
    );
    const r = await generateImage(code, "rs", {
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
    const buffer = new io.Buffer();
    await buffer.readFrom(r);
    const got = buffer.bytes();
    const want = await Deno.readFile(path.join("testdata", "out.png"));
    assertEquals(got, want);
  },
});

Deno.test({
  name: "invalid options",
  fn: async () => {
    await assertRejects(
      async () => {
        await generateImage("", "hoge");
      },
      Error,
      "unsupported language"
    );

    await assertRejects(
      async () => {
        await generateImage("", "rs", { theme: "hoge" });
      },
      Error,
      "unsupported theme"
    );

    await assertRejects(
      async () => {
        await generateImage("", "rs", { background_color: "hoge" });
      },
      Error,
      "invalid color: Invalid digit"
    );

    await assertRejects(
      async () => {
        await generateImage("", "rs", { highlight_lines: "1;" });
      },
      Error,
      "cannot parse integer from empty string"
    );
  },
});
