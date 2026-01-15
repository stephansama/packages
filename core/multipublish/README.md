# @stephansama/multipublish

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/multipublish)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/multipublish)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fmultipublish?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/multipublish)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/multipublish?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/multipublish)

Publish packages to multiple providers easily

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [GitHub NPM Registry](#github-npm-registry)
  - [JSR](#jsr)
  - [Changesets](#changesets)

</details>

## Installation

```sh
pnpm install @stephansama/multipublish
```

## Usage

### Configuration

You can configure `multipublish` by creating a configuration file (or object) in the root of your project. The following file formats are supported:

- `package.json`
- `.multipublishrc.cjs`
- `.multipublishrc.js`
- `.multipublishrc.json`
- `.multipublishrc.mjs`
- `.multipublishrc.ts`
- `.multipublishrc.yaml`
- `.multipublishrc.yml`
- `.multipublishrc`
- `.config/.multipublishrc.json`
- `.config/.multipublishrc.yaml`
- `.config/.multipublishrc.yml`
- `.config/.multipublishrc`
- `.config/multipublishrc.cjs`
- `.config/multipublishrc.js`
- `.config/multipublishrc.json`
- `.config/multipublishrc.mjs`
- `.config/multipublishrc.ts`
- `.config/multipublishrc.yaml`
- `.config/multipublishrc.yml`
- `.config/multipublishrc`
- `multipublish.config.cjs`
- `multipublish.config.js`
- `multipublish.config.mjs`
- `multipublish.config.ts`

```json
{
  "$schema": "./node_modules/@stephansama/multipublish/config/schema.json",
  "platforms": [
    ["jsr", { "experimentalGenerateJSR": true, "defaultExclude": ["!dist"] }],
    [
      "npm",
      {
        "registry": "https://npm.pkg.github.com",
        "tokenEnvironmentKey": "GITHUB_TOKEN"
      }
    ]
  ]
}
```

### GitHub NPM Registry

If publishing to the GitHub NPM registry, you must add `packages` to permissions when using a GitHub token. And allow `write` and `read` permissions for workflows (located in repo settings > actions > general).

```yaml
permissions:
  packages: write
```

### JSR

When publishing to JSR, you must either have a valid `jsr.json` or `deno.json`, or allow `experimentalGenerateJSR` using the config option.

### Changesets

In order to use this with changesets, please update your version script with a preversion script that calls the `multipublish` CLI.

```json
{
  "scripts": {
    "preversion": "multipublish",
    "version": "changeset version"
  }
}
```

<!-- ZOD path="./src/schema.ts" start -->

# Zod Schema

## Config

_Object containing the following properties:_

| Property             | Type                    | Default      |
| :------------------- | :---------------------- | :----------- |
| **`platforms`** (\*) | [Platforms](#platforms) |              |
| `tmpDirectory`       | `string`                | `'.release'` |
| `useChangesets`      | `boolean`               | `true`       |

_(\*) Required._

## JsrPlatformOptions

_Object containing the following properties:_

| Property                     | Type            | Default |
| :--------------------------- | :-------------- | :------ |
| `allowSlowTypes`             | `boolean`       | `true`  |
| `commitJsrVersionUpdate`     | `boolean`       | `false` |
| `defaultExclude`             | `Array<string>` |         |
| `defaultInclude`             | `Array<string>` |         |
| `experimentalGenerateJSR`    | `boolean`       | `false` |
| `experimentalUpdateCatalogs` | `boolean`       | `false` |

_All properties are optional._

## NpmPlatformOptions

_Object containing the following properties:_

| Property              | Type                         | Default                         |
| :-------------------- | :--------------------------- | :------------------------------ |
| `registry`            | `string`                     | `'https://registry.npmjs.org/'` |
| `strategy`            | `'.npmrc' \| 'package.json'` | `'.npmrc'`                      |
| `tokenEnvironmentKey` | `string`                     | `'NODE_AUTH_TOKEN'`             |

_All properties are optional._

## Platforms

*Array of `'jsr' | 'npm'` *or\* _Tuple:_<ol><li>`'jsr'`</li><li>[JsrPlatformOptions](#jsrplatformoptions)</li></ol> _or_ _Tuple:_<ol><li>`'npm'`</li><li>[NpmPlatformOptions](#npmplatformoptions)</li></ol> items.\*

<!-- ZOD end -->
