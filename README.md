# deno-silicon

Deno module to generate images from source code using
[Aloxaf/silicon](https://github.com/Aloxaf/silicon).

![](https://i.gyazo.com/ab38b1037f15fb0c8132264ced695067.png)

## Dependencies

Please refer silicon's
[dependencies](https://github.com/Aloxaf/silicon#dependencies)

## Support Version

| `deno-silicon` | `Deno`               |
| -------------- | -------------------- |
| v0.0.2         | `v1.24.3` or earlier |
| v0.0.3 ~       | `v1.25.0` or later   |
| v0.0.5 ~       | `v1.32.4` or later   |

## Usage

You can call `generate(code, language, options)` to generates image from source
code.

```typescript
const code = `package main

import {
    "fmt"
}

func main() {
    fmt.Println("Hello World")
}`;

const data = generate(code, "go", { theme: "Dracula" });
await Deno.writeFile("out.png", data);
```

`code` and `language` are required; `options` is optional.\
The options conform to silicon options, see silicon help for details.

## Thanks

- [Aloxaf/silicon](https://github.com/Aloxaf/silicon)
