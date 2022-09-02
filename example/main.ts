import * as silicon from "https://deno.land/x/silicon@v0.0.1/mod.ts";
import { readAll } from "https://deno.land/std@0.153.0/streams/conversion.ts";

const code = `package main

import {
  "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;

const r = await silicon.generateImage(code, "go", { theme: "Dracula" });
await Deno.writeFile("out.png", await readAll(r));
