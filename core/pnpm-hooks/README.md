# @stephansama/pnpm-hooks

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/pnpm-hooks)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/pnpm-hooks)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fpnpm-hooks?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/pnpm-hooks)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/pnpm-hooks)](https://socket.dev/npm/package/@stephansama/pnpm-hooks/overview)
[![jsr](https://jsr.io/badges/@stephansama/pnpm-hooks)](https://jsr.io/@stephansama/pnpm-hooks)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/pnpm-hooks?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/pnpm-hooks)

[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

preconfigured pnpm hooks and types for pnpmfile

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Why](#why)
- [What this package exports](#what-this-package-exports)
- [Included hooks](#included-hooks)
  - [`readPackageHooks.pinAllDependencies`](#readpackagehookspinalldependencies)
- [Hook examples](#hook-examples)
  - [`readPackageHooks.pinAllDependencies`](#readpackagehookspinalldependencies-1)
- [Requirements](#requirements)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/pnpm-hooks
```

## Why

`pnpmfile` hooks are useful, but the types and small reusable hook helpers are easy to reimplement in every workspace. This package collects both:

- ready-to-use pnpm hook implementations
- exported TypeScript types for authoring your own `pnpmfile` hooks

## What this package exports

The package exposes two top-level namespaces:

- `readPackageHooks`
  prebuilt `readPackage` hook utilities
- `types`
  pnpm hook types including `PnpmFileHooks`, `ReadPackageHook`, `BeforePackingHook`, `AfterAllResolvedHook`, `ImportPackageHook`, `PreResolutionHook`, and `UpdateConfigHook`

## Included hooks

The sections below are organized so each hook can carry its own behavior notes and example output as the package grows.

### `readPackageHooks.pinAllDependencies`

Pins dependency ranges by removing leading `^` and `~` prefixes from:

- `dependencies`
- `devDependencies`
- `optionalDependencies`

This runs on every manifest processed by pnpm through the `readPackage` hook, which makes it useful for workspaces that want consistently pinned transitive and nested dependency ranges during resolution.

## Hook examples

### `readPackageHooks.pinAllDependencies`

Given a dependency manifest like this:

```json
{
  "dependencies": {
    "react": "^19.1.0"
  },
  "devDependencies": {
    "typescript": "~5.9.2"
  },
  "optionalDependencies": {
    "@types/node": "^24.0.0"
  }
}
```

`pinAllDependencies` rewrites it to:

```json
{
  "dependencies": {
    "react": "19.1.0"
  },
  "devDependencies": {
    "typescript": "5.9.2"
  },
  "optionalDependencies": {
    "@types/node": "24.0.0"
  }
}
```

## Requirements

- Node.js `>=24`
- a pnpm setup that loads a `pnpmfile`

## Usage

```javascript
import { readPackageHooks } from "@stephansama/pnpm-hooks";

/** @type {import("../dist/index.mjs").types.PnpmFileHooks} */
export const hooks = {
  readPackage: readPackageHooks.pinAllDependencies,
};
```
