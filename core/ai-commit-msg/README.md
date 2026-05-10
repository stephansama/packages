<div align="center">

# [`@stephansama`](https://github.com/stephansama) / ai-commit-msg

</div>

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/ai-commit-msg)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/ai-commit-msg)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fai-commit-msg?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)
[![JSR](https://jsr.io/badges/@stephansama/ai-commit-msg)](https://jsr.io/@stephansama/ai-commit-msg)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/ai-commit-msg)](https://socket.dev/npm/package/@stephansama/ai-commit-msg/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/ai-commit-msg?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)

generate commit messages using ai

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [CLI Options](#cli-options)
- [Usage](#usage)
  - [Husky](#husky)

</details>

## Installation

```sh
pnpm install @stephansama/ai-commit-msg
```

## CLI Options

| Option      | Alias | Description                | Type      |
| :---------- | :---- | :------------------------- | :-------- |
| `--config`  | `-c`  | Path to config file        | `string`  |
| `--output`  | `-o`  | Output file for commit-msg | `string`  |
| `--verbose` | `-v`  | Enable verbose logging     | `boolean` |

## Usage

### Husky

1. Install and initialize husky

   ```sh
   npm install --save-dev husky && npx husky init
   ```

2. create the `prepare-commit-msg` hook by creating a file located at
   `.husky/prepare-commit-msg`

   ```sh
   #!/bin/sh

   ai-commit-msg -o "$1"
   ```
