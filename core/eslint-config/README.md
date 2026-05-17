<div align="center">

# [`@stephansama`](https://github.com/stephansama) / eslint-config

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/eslint-config)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/eslint-config)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Feslint-config?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/eslint-config)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/eslint-config)](https://socket.dev/npm/package/@stephansama/eslint-config/overview)
[![jsr](https://jsr.io/badges/@stephansama/eslint-config)](https://jsr.io/@stephansama/eslint-config)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/eslint-config?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/eslint-config)

[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![eslint](https://img.shields.io/badge/eslint-10.2.1-4B32C3.svg?logo=eslint&logoColor=ffffff&labelColor=4B32C3)](https://npmx.dev/package/eslint)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

A modular, composable ESLint flat config package with 25+ configs covering JavaScript, TypeScript, frameworks, testing, and file formats. Supports auto-detection of installed packages and ships with a CLI for interactive setup.

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [Configs](#configs)
  - [Core](#core)
  - [Code Quality](#code-quality)
  - [Package Management](#package-management)
  - [Node.js](#nodejs)
  - [Frameworks (async, auto-detected)](#frameworks-async-auto-detected)
  - [Testing & Validation](#testing--validation)
  - [File Formats (async)](#file-formats-async)
- [Presets](#presets)
- [CLI Commands](#cli-commands)
  - [CLI Flags](#cli-flags)

</details>

## Installation

```sh
pnpm install @stephansama/eslint-config
```

## Usage

```typescript
import { config, presets } from "@stephansama/eslint-config";

export default await config({
  ...presets.base,
});
```

## Configs

### Core

| Config       | Plugin(s)                   | Description                                                                         |
| ------------ | --------------------------- | ----------------------------------------------------------------------------------- |
| `baseline`   | `eslint-plugin-baseline-js` | Enforces Baseline-widely-available web features; configurable availability level    |
| `javascript` | `@eslint/js`                | Recommended JS rules with browser/node globals, JSX, ES2021                         |
| `typescript` | `typescript-eslint`         | Type-checked recommended rules via `projectService`                                 |
| `e18e`       | `@e18e/eslint-plugin`       | Modern API preferences (`Object.hasOwn`, nullish coalescing, `Array` methods, etc.) |

### Code Quality

| Config          | Plugin(s)                     | Description                                                   |
| --------------- | ----------------------------- | ------------------------------------------------------------- |
| `imports`       | `eslint-plugin-import-x`      | Import ordering and resolution with TypeScript resolver       |
| `jsdoc`         | `eslint-plugin-jsdoc`         | JSDoc validation (TypeScript-aware; `require-jsdoc` disabled) |
| `unicorn`       | `eslint-plugin-unicorn`       | Opinionated best practices with custom abbreviation allowlist |
| `perfectionist` | `eslint-plugin-perfectionist` | Natural-sort ordering for imports, exports, and object keys   |
| `prettier`      | `eslint-plugin-prettier`      | Prettier formatting as ESLint warnings                        |
| `regexp`        | `eslint-plugin-regexp`        | Regex best practices                                          |
| `command`       | `eslint-plugin-command`       | Magic comment commands (e.g. `// @keep-sorted`)               |

### Package Management

| Config        | Plugin(s)                                                       | Description                                                                               |
| ------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `packagejson` | `eslint-plugin-package-json`, `eslint-plugin-node-dependencies` | Validates `package.json` — versions, deps, provenance; `isLibrary` option adds sort rules |
| `pnpm`        | `eslint-plugin-pnpm`                                            | Enforces pnpm catalog usage and workspace settings                                        |
| `gitignore`   | `eslint-config-flat-gitignore`                                  | Applies `.gitignore` patterns as ESLint ignores                                           |

### Node.js

| Config | Plugin(s)         | Description                                                                 |
| ------ | ----------------- | --------------------------------------------------------------------------- |
| `node` | `eslint-plugin-n` | Node.js recommended rules; missing-import resolution delegated to `imports` |

### Frameworks (async, auto-detected)

| Config      | Plugin(s)                 | Description                                                             |
| ----------- | ------------------------- | ----------------------------------------------------------------------- |
| `astro`     | `eslint-plugin-astro`     | Astro recommended + jsx-a11y-strict (opt out via `disableA11yStrict`)   |
| `svelte`    | `eslint-plugin-svelte`    | Svelte with TypeScript parser support                                   |
| `vue`       | —                         | Placeholder (empty config)                                              |
| `lit`       | `eslint-plugin-lit`       | Lit element rules (attribute names, binding positions, lifecycle, etc.) |
| `storybook` | `eslint-plugin-storybook` | Storybook flat/recommended                                              |

### Testing & Validation

| Config   | Plugin(s)               | Description                                                                |
| -------- | ----------------------- | -------------------------------------------------------------------------- |
| `vitest` | `@vitest/eslint-plugin` | Vitest rules for `**/*.test.{ts,js}`; `typeAware` option (default: `true`) |
| `zod`    | `eslint-plugin-zod`     | Zod schema best practices                                                  |

### File Formats (async)

| Config     | Plugin(s)             | Description                                                     |
| ---------- | --------------------- | --------------------------------------------------------------- |
| `json`     | `eslint-plugin-jsonc` | JSON/JSONC linting                                              |
| `markdown` | `@eslint/markdown`    | Markdown code block linting; disables noisy rules inside fences |
| `css`      | `@eslint/css`         | CSS rules (font fallbacks, selector complexity, layers, etc.)   |

## Presets

Presets are pre-composed sets of configs you can spread into the `config()` call.

| Preset           | Configs Included                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base` (default) | `baseline`, `e18e`, `gitignore`, `imports`, `javascript`, `jsdoc`, `packagejson`, `perfectionist`, `pnpm`, `prettier`, `regexp`, `typescript`, `unicorn` |
| `zod`            | `zod`                                                                                                                                                    |
| `library`        | `packagejson` with `isLibrary: true`                                                                                                                     |

```javascript
import { config, presets } from "@stephansama/eslint-config";

export default config({
  ...presets.base,
  // enable additional configs
  vitest: true,
  node: true,
});
```

## CLI Commands

- `generate`: Generates an ESLint config based on interactive prompts.
- `update`: Updates ESLint dependencies to match current config options.

### CLI Flags

| Flag             | Alias | Command  | Description                           | Default            |
| :--------------- | :---- | :------- | :------------------------------------ | :----------------- |
| `--config`       | `-c`  | Both     | Location of ESLint configuration file | `eslint.config.ts` |
| `--verbose`      | `-v`  | Both     | Enable verbose output                 |                    |
| `--package-json` | `-p`  | `update` | Location of `package.json` to update  | `package.json`     |
