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

</details>

## Installation

```sh
pnpm install @stephansama/multipublish
```

## Usage

```sh
multipublish
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
