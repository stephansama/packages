# @stephansama/github-env

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/packages/github-env)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/modules/_stephansama_github-env)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fgithub-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/github-env)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/github-env?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/github-env)

Additional environment variable types for GitHub CI

## Installation

To use these type definitions, add the package to your `devDependencies`:

```sh
pnpm install --save-dev @stephansama/github-env
```

## Usage

In order to enable the GitHub environment variables into your local scope you can either add the following to your `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@stephansama/github-env"]
  }
}
```

or add the following reference to any typescript file

```ts
/// <reference types="@stephansama/github-env" />
```

🎉 Now you have access to GitHub environment variables in your TypeScript files!
