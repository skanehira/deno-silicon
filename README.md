# deno-silicon
Deno module to generate images from source code using [Aloxaf/silicon](https://github.com/Aloxaf/silicon).

## Dependencies
Please refer silicon's [dependencies](https://github.com/Aloxaf/silicon#dependencies)

## Usage
You can call `generateImage(code, language, options)` to generates image from source code.

```ts
const code = `package main

import {
  "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;

const r = await generateImage(code, "go", { theme: "Dracula" });
await Deno.writeFile("out.png", await readAll(r));
```

`code` and `language` are required; `options` is optional.  
The options conform to silicon options, see silicon help for details.

## Thanks
- [Aloxaf/silicon](https://github.com/Aloxaf/silicon)
