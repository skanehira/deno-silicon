import * as silicon from "../mod.ts";

const code = `package main

import {
    "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;

const data = silicon.generate(code, "go", { theme: "Dracula" });
await Deno.writeFile("out.png", data);
