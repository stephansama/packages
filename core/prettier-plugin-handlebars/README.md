<div align="center">

# @stephansama/prettier-plugin-handlebars

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/prettier-plugin-handlebars)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/prettier-plugin-handlebars)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fprettier-plugin-handlebars?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/prettier-plugin-handlebars)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/prettier-plugin-handlebars)](https://socket.dev/npm/package/@stephansama/prettier-plugin-handlebars/overview)
[![jsr](https://jsr.io/badges/@stephansama/prettier-plugin-handlebars)](https://jsr.io/@stephansama/prettier-plugin-handlebars)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/prettier-plugin-handlebars?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/prettier-plugin-handlebars)

[![prettier](https://img.shields.io/badge/prettier-3.8.1-F7B93E.svg?logo=prettier&logoColor=ffffff&labelColor=F7B93E)](https://npmx.dev/package/prettier)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

Prettier plugin that automatically assigns the default parser for various handlebars files

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/prettier-plugin-handlebars
```

## Usage

```javascript
import prettierPluginHandlebars from "../dist/index.mjs";

/** @type {import("prettier").Config} */
export default {
  plugins: [prettierPluginHandlebars],
};
```
