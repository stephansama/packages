# Auto Readme 🪄

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/packages/auto-readme)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/modules/_stephansama_auto-readme)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)

Generate lists and tables for your README automagically based on your repository

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [CLI Options](#cli-options)
- [Configuration](#configuration)
  - [Configuration File](#configuration-file)
    - [JSON Example](#json-example)
    - [YAML Example](#yaml-example)
    - [JavaScript Example](#javascript-example)
    - [TypeScript Example](#typescript-example)
  - [Schema](#schema)

</details>

## Installation

```sh
pnpm install @stephansama/auto-readme
```

## Usage

In order to run the script you need to do two things

1. Create either a heading or a comment to enable the corresponding feature
2. Run the following command:

```sh
pnpx @stephansama/auto-readme [options]
```

To turn on table of content enable the setting `enableToc` and add the following header

```md
## Table of contents
```

To turn on the usage generator enable the setting `enableUsage` and add the following header

```md
## Usage
```

To use the zod generator add the following comments

```md
<!-- ZOD path="./path/to/zod.js" start -->
<!-- ZOD end -->
```

There are more [Actions](#actions) that you can use in conjunction with different [languages](#language) and [formats](#formats) like so:

```md
<!-- JS-WORKSPACE-TABLE start -->
<!-- JS-WORKSPACE-TABLE end -->
```

You can run `auto-readme` as a pre-commit git hook to automatically keep your `README`s up to date. For example, you can use `husky` to add the following to your `.husky/pre-commit` file:

```sh
auto-readme -g
```

This will run `auto-readme` only when affected `README` files are changed

## CLI Options

| Option      | Alias | Description                                   | Type      | Default |
| :---------- | :---- | :-------------------------------------------- | :-------- | :------ |
| `--changes` | `-g`  | Check only changed git files                  | `boolean` | `false` |
| `--check`   | `-k`  | Do not write to files. Only check for changes | `boolean` | `false` |
| `--config`  | `-c`  | Path to config file                           | `string`  |         |
| `--verbose` | `-v`  | whether or not to display verbose logging     | `boolean` | `false` |

Most of the options in the [schema](#schema) below can also be used as command-line flags.

## Configuration

`auto-readme` can be configured using a variety of files, such as `package.json` with an `auto-readme` property, or a standalone `.autoreadmerc` file. For more information on configuration files, see [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig).

### Configuration File

You can configure `auto-readme` by creating a configuration file (or object) in the root of your project. The following file formats are supported:

- `package.json`
- `.autoreadmerc.cjs`
- `.autoreadmerc.js`
- `.autoreadmerc.json`
- `.autoreadmerc.mjs`
- `.autoreadmerc.toml`
- `.autoreadmerc.ts`
- `.autoreadmerc.yaml`
- `.autoreadmerc.yml`
- `.autoreadmerc`
- `.config/.autoreadmerc.json`
- `.config/.autoreadmerc.toml`
- `.config/.autoreadmerc.yaml`
- `.config/.autoreadmerc.yml`
- `.config/.autoreadmerc`
- `.config/autoreadmerc.cjs`
- `.config/autoreadmerc.js`
- `.config/autoreadmerc.json`
- `.config/autoreadmerc.mjs`
- `.config/autoreadmerc.toml`
- `.config/autoreadmerc.ts`
- `.config/autoreadmerc.yaml`
- `.config/autoreadmerc.yml`
- `.config/autoreadmerc`
- `autoreadme.config.cjs`
- `autoreadme.config.js`
- `autoreadme.config.mjs`
- `autoreadme.config.ts`

#### JSON Example

```json
{
  "$schema": "./node_modules/@stephansama/auto-readme/config/schema.json",
  "disableEmojis": true
}
```

#### YAML Example

```yaml
# yaml-language-server: $schema=./node_modules/@stephansama/auto-readme/config/schema.yaml
disableEmojis: true
```

#### JavaScript Example

```javascript
/** @type {import('@stephansama/auto-readme').Config} */
export default {
  disableEmojis: true,
};
```

#### TypeScript Example

```typescript
import type { Config } from "@stephansama/auto-readme";

export default {
  disableEmojis: true,
} satisfies Config;
```

### Schema

<!-- ZOD path="./src/schema.js" start -->

# Zod Schema

## Actions

Comment action options

_Enum, one of the following possible values:_

- `'ACTION'`
- `'PKG'`
- `'USAGE'`
- `'WORKSPACE'`
- `'ZOD'`

## Config

_Object containing the following properties:_

| Property                  | Description                                                 | Type                                                                                                                                                                                                                                                                                    | Default                                                                                                                                                                                                                                                                                                                                                                                         |
| :------------------------ | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `affectedRegexes`         |                                                             | `Array<string>`                                                                                                                                                                                                                                                                         | `[]`                                                                                                                                                                                                                                                                                                                                                                                            |
| `defaultLanguage`         | Default language to infer projects from                     | [Language](#language)                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                 |
| `disableEmojis`           | Whether or not to use emojis in markdown table headings     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |
| `disableMarkdownHeadings` | Whether or not to display markdown headings                 | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |
| `enableToc`               | generate table of contents for readmes                      | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |
| `enableUsage`             | Whether or not to enable usage plugin                       | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |
| `headings`                | List of headings for different table outputs                | _Object with dynamic keys of type_ [Actions](#actions) _and values of type_ _Array of [Headings](#headings) items_ (_optional_)                                                                                                                                                         | `{"ACTION":["name","required","default","description"],"PKG":["name","version","devDependency"],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`                                                                                                                                                                                                                             |
| `onlyReadmes`             | Whether or not to only traverse readmes                     | `boolean`                                                                                                                                                                                                                                                                               | `true`                                                                                                                                                                                                                                                                                                                                                                                          |
| `onlyShowPublicPackages`  | Only show public packages in workspaces                     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |
| `removeScope`             | Remove common workspace scope                               | `string`                                                                                                                                                                                                                                                                                | `''`                                                                                                                                                                                                                                                                                                                                                                                            |
| `templates`               | Handlebars templates used to fuel list and table generation | _Object with properties:_<ul><li>`downloadImage`: `string`</li><li>`emojis`: _Object with dynamic keys of type_ [Headings](#headings) _and values of type_ `string` - Table heading emojis used when enabled</li><li>`registryUrl`: `string`</li><li>`versionImage`: `string`</li></ul> | `{"downloadImage":"https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F","emojis":{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""},"registryUrl":"https://www.npmjs.com/package/{{name}}","versionImage":"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"}` |
| `tocHeading`              | Markdown heading used to generate table of contents         | `string`                                                                                                                                                                                                                                                                                | `'Table of contents'`                                                                                                                                                                                                                                                                                                                                                                           |
| `usageFile`               | Workspace level usage file                                  | `string`                                                                                                                                                                                                                                                                                | `''`                                                                                                                                                                                                                                                                                                                                                                                            |
| `usageHeading`            | Markdown heading used to generate usage example             | `string`                                                                                                                                                                                                                                                                                | `'Usage'`                                                                                                                                                                                                                                                                                                                                                                                       |
| `verbose`                 | whether or not to display verbose logging                   | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                         |

_All properties are optional._ (_optional_)

## Formats

_Enum, one of the following possible values:_

- `'LIST'`
- `'TABLE'`
  (_optional_)

_Default value:_ `'TABLE'`

## Headings

Table heading options

_Enum, one of the following possible values:_

- `'default'`
- `'description'`
- `'devDependency'`
- `'downloads'`
- `'name'`
- `'private'`
- `'required'`
- `'version'`

## Language

_Enum, one of the following possible values:_

- `'JS'`
- `'RS'`
  (_optional_)

_Default value:_ `'JS'`

## TableHeadings

Table heading action configuration

_Object record with dynamic keys:_

- _keys of type_ [Actions](#actions)
- _values of type_ _Array of [Headings](#headings) items_ (_optional_)
  (_optional_)

_Default value:_ `{"ACTION":["name","required","default","description"],"PKG":["name","version","devDependency"],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`

## Templates

_Object containing the following properties:_

| Property        | Description                            | Type                                                                                   | Default                                                                                                                           |
| :-------------- | :------------------------------------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `downloadImage` |                                        | `string`                                                                               | `'https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F'`                                                                      |
| `emojis`        | Table heading emojis used when enabled | _Object with dynamic keys of type_ [Headings](#headings) _and values of type_ `string` | `{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""}` |
| `registryUrl`   |                                        | `string`                                                                               | `'https://www.npmjs.com/package/{{name}}'`                                                                                        |
| `versionImage`  |                                        | `string`                                                                               | `'https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F'`                               |

_All properties are optional._

<!-- ZOD end -->
