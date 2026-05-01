# @stephansama/eslint-config

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/eslint-config)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/eslint-config)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Feslint-config?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/eslint-config)
[![JSR](https://jsr.io/badges/@stephansama/eslint-config)](https://jsr.io/@stephansama/eslint-config)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/eslint-config)](https://socket.dev/npm/package/@stephansama/eslint-config/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/eslint-config?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/eslint-config)

stephansama eslint configuration for multiple use cases

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/eslint-config
```

## Usage

```javascript
import { config, presets } from "../dist/index.js";

export default config({
  ...presets.base,
});
```
