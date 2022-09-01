import { generateImage } from "../mod.ts";
import { readAll } from "https://deno.land/std@0.153.0/streams/conversion.ts";

const code = `package main

import {
  "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;

const r = await generateImage(code, "go", { theme: "Dracula" });
await Deno.writeFile("out.png", await readAll(r));
