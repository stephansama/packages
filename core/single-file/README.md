<div align="center">

# [`@stephansama`](https://github.com/stephansama) / single-file

<!-- BADGE start -->

[![cheerio](https://img.shields.io/badge/cheerio-catalog:-E88C1F.svg?logo=cheerio&logoColor=ffffff&labelColor=E88C1F)](https://npmx.dev/package/cheerio)
[![oxc-parser](https://img.shields.io/badge/oxc-parser-catalog:-00F7F1.svg?logo=oxc&logoColor=ffffff&labelColor=00F7F1)](https://npmx.dev/package/oxc-parser)

<!-- BADGE end -->

</div>

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/single-file)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/single-file)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fsingle-file?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/single-file)
[![JSR](https://jsr.io/badges/@stephansama/single-file)](https://jsr.io/@stephansama/single-file)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/single-file)](https://socket.dev/npm/package/@stephansama/single-file/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/single-file?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/single-file)

Fetch any webpage and produce a fully self-contained HTML file with all external resources — images, stylesheets, scripts, and SVGs — inlined directly into the document.

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [CLI](#cli)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/single-file
```

## CLI

```sh
# outputs to single-file.html by default
npx @stephansama/single-file <url>

# custom output path
npx @stephansama/single-file <url> --output my-page.html
npx @stephansama/single-file <url> -o my-page.html

# verbose logging
npx @stephansama/single-file <url> --verbose
npx @stephansama/single-file <url> -v
```

| Flag        | Alias | Default            | Description                   |
| ----------- | ----- | ------------------ | ----------------------------- |
| `--output`  | `-o`  | `single-file.html` | Output path for the HTML file |
| `--verbose` | `-v`  | `false`            | Enable verbose output         |

## Usage

```javascript
import * as singleFile from "@stephansama/single-file";

export async function useAPI() {
  const file = await singleFile.convertPageToSingleFile(
    "https://blog.stephansama.info",
  );

  console.info(file);
}
```
