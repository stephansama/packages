<div align="center">

# [`@stephansama`](https://github.com/stephansama) / types-github-action-env

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/types-github-action-env)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/types-github-action-env)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ftypes-github-action-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-github-action-env)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/types-github-action-env)](https://socket.dev/npm/package/@stephansama/types-github-action-env/overview)
[![jsr](https://jsr.io/badges/@stephansama/types-github-action-env)](https://jsr.io/@stephansama/types-github-action-env)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/types-github-action-env?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/types-github-action-env)

<!-- BADGE end -->

</div>

Additional environment variable types for GitHub CI

## Installation

To use these type definitions, add the package to your `devDependencies`:

```sh
pnpm install --save-dev @stephansama/types-github-action-env
```

## Usage

In order to enable the GitHub environment variables into your local scope you can either add the following to your `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@stephansama/types-github-action-env"]
  }
}
```

or add the following reference to any typescript file

```ts
/// <reference types="@stephansama/types-github-action-env" />
```

🎉 Now you have access to GitHub environment variables in your TypeScript files!
