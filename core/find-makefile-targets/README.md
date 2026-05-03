<div align="center">

# [`@stephansama`](https://github.com/stephansama) / [`find-makefile-targets`](https://packages.stephansama.info/api/@stephansama/find-makefile-targets/)

</div>

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/find-makefile-targets)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/find-makefile-targets)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ffind-makefile-targets?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/find-makefile-targets)
[![JSR](https://jsr.io/badges/@stephansama/find-makefile-targets)](https://jsr.io/@stephansama/find-makefile-targets)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/find-makefile-targets)](https://socket.dev/npm/package/@stephansama/find-makefile-targets/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/find-makefile-targets?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/find-makefile-targets)

Finds targets in a Makefile. The output is formatted to be easily piped into other tools like `fzf`

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/find-makefile-targets
```

## Usage

```sh
fzf . | xargs -L 1 find-makefile-targets
```
