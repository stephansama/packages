# @stephansama/ai-commit-msg

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/ai-commit-msg)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/ai-commit-msg)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fai-commit-msg?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/ai-commit-msg?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)

generate commit messages using ai

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [Husky](#husky)

</details>

## Installation

```sh
pnpm install @stephansama/ai-commit-msg
```

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
