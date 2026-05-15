# @stephansama/pnpm-hooks

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/pnpm-hooks)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/pnpm-hooks)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fpnpm-hooks?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/pnpm-hooks)
[![JSR](https://jsr.io/badges/@stephansama/pnpm-hooks)](https://jsr.io/@stephansama/pnpm-hooks)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/pnpm-hooks)](https://socket.dev/npm/package/@stephansama/pnpm-hooks/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/pnpm-hooks?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/pnpm-hooks)

preconfigured pnpm hooks and types for pnpmfile

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/pnpm-hooks
```

## Usage

```javascript
import { readPackageHooks } from "@stephansama/pnpm-hooks";

/** @type {import("../dist/index.mjs").types.PnpmFileHooks} */
export const hooks = {
  readPackage: readPackageHooks.pinAllDependencies,
};
```
