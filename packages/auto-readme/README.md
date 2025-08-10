# Auto Readme 🪄

[![Source code](https://img.shields.io/badge/Source-666666?style=flat\&logo=github\&label=Github\&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/packages/auto-readme)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat\&logo=Wikibooks\&labelColor=211F1F)](https://packages.stephansama.info/modules/_stephansama_auto-readme)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm\&logoColor=red\&color=211F1F\&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)

Generate lists and tables for your README automagically based on your repository

##### Table of contents

<details><summary>Open Table of contents</summary>

* [Installation](#installation)
* [Usage](#usage)
* [CLI Options](#cli-options)
* [Configuration](#configuration)
  * [Configuration File](#configuration-file)
    * [JSON Example](#json-example)
    * [YAML Example](#yaml-example)
    * [JavaScript Example](#javascript-example)
    * [TypeScript Example](#typescript-example)
  * [Schema](#schema)

</details>

## Installation

```sh
pnpm install @stephansama/auto-readme
```

<!-- USAGE path="./example/index.js" start -->

## Usage

In order to run the script just use

```sh
pnpx @stephansama/auto-readme [options]
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

* `package.json`
* `.autoreadmerc`
* `.autoreadmerc.json`
* `.autoreadmerc.yaml`
* `.autoreadmerc.yml`
* `.autoreadmerc.js`
* `.autoreadmerc.ts`
* `.autoreadmerc.mjs`
* `.autoreadmerc.cjs`
* `.config/autoreadmerc`
* `.config/autoreadmerc.json`
* `.config/autoreadmerc.yaml`
* `.config/autoreadmerc.yml`
* `.config/autoreadmerc.js`
* `.config/autoreadmerc.ts`
* `.config/autoreadmerc.mjs`
* `.config/autoreadmerc.cjs`
* `autoreadme.config.js`
* `autoreadme.config.ts`
* `autoreadme.config.mjs`
* `autoreadme.config.cjs`

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

*Enum, one of the following possible values:*

* `'ACTION'`
* `'PKG'`
* `'USAGE'`
* `'WORKSPACE'`
* `'ZOD'`

## Config

*Object containing the following properties:*

| Property                  | Description                                                 | Type                                                                                                                                                                                                                                                                                    | Default                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------------ | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `affectedRegexes`         |                                                             | `Array<string>`                                                                                                                                                                                                                                                                         | `[]`                                                                                                                                                                                                                                                                                                                                                                                             |
| `defaultLanguage`         | Default language to infer projects from                     | [Language](#language)                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                  |
| `disableEmojis`           | Whether or not to use emojis in markdown table headings     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `disableMarkdownHeadings` | Whether or not to display markdown headings                 | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `enableUsage`             | Whether or not to enable usage plugin                       | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `headings`                | List of headings for different table outputs                | *Object with dynamic keys of type* [Actions](#actions) *and values of type* *Array of [Headings](#headings) items* (*optional*)                                                                                                                                                         | `{"ACTION":["name","required","default","description"],"PKG":["name","version","devDependency"],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`                                                                                                                                                                                                                              |
| `onlyReadmes`             | Whether or not to only traverse readmes                     | `boolean`                                                                                                                                                                                                                                                                               | `true`                                                                                                                                                                                                                                                                                                                                                                                           |
| `onlyShowPublicPackages`  | Only show public packages in workspaces                     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `removeScope`             | Remove common workspace scope                               | `string`                                                                                                                                                                                                                                                                                | `''`                                                                                                                                                                                                                                                                                                                                                                                             |
| `templates`               | Handlebars templates used to fuel list and table generation | *Object with properties:*<ul><li>`downloadImage`: `string`</li><li>`emojis`: *Object with dynamic keys of type* [Headings](#headings) *and values of type* `string` - Table heading emojis used when enabled</li><li>`registryUrl`: `string`</li><li>`versionImage`: `string`</li></ul> | `{"downloadImage":"https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F","emojis":{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""},"registryUrl":"https://www.npmjs.com/package/{{name}}","versionImage":"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"}` |
| `tocHeading`              | Markdown heading used to generate table of contents         | `string`                                                                                                                                                                                                                                                                                | `'Table of contents'`                                                                                                                                                                                                                                                                                                                                                                            |
| `usageFile`               | Workspace level usage file                                  | `string`                                                                                                                                                                                                                                                                                | `''`                                                                                                                                                                                                                                                                                                                                                                                             |
| `usageHeading`            | Markdown heading used to generate usage example             | `string`                                                                                                                                                                                                                                                                                | `'Usage'`                                                                                                                                                                                                                                                                                                                                                                                        |
| `useToc`                  | generate table of contents for readmes                      | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `verbose`                 | whether or not to display verbose logging                   | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |

*All properties are optional.* (*optional*)

## Formats

*Enum, one of the following possible values:*

* `'LIST'`
* `'TABLE'`
  (*optional*)

*Default value:* `'TABLE'`

## Headings

Table heading options

*Enum, one of the following possible values:*

* `'default'`
* `'description'`
* `'devDependency'`
* `'downloads'`
* `'name'`
* `'private'`
* `'required'`
* `'version'`

## Language

*Enum, one of the following possible values:*

* `'JS'`
* `'RS'`
  (*optional*)

*Default value:* `'JS'`

## TableHeadings

Table heading action configuration

*Object record with dynamic keys:*

* *keys of type* [Actions](#actions)
* *values of type* *Array of [Headings](#headings) items* (*optional*)
  (*optional*)

*Default value:* `{"ACTION":["name","required","default","description"],"PKG":["name","version","devDependency"],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`

## Templates

*Object containing the following properties:*

| Property        | Description                            | Type                                                                                   | Default                                                                                                                            |
| :-------------- | :------------------------------------- | :------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `downloadImage` |                                        | `string`                                                                               | `'https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F'`                                                                       |
| `emojis`        | Table heading emojis used when enabled | *Object with dynamic keys of type* [Headings](#headings) *and values of type* `string` | `{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""}` |
| `registryUrl`   |                                        | `string`                                                                               | `'https://www.npmjs.com/package/{{name}}'`                                                                                         |
| `versionImage`  |                                        | `string`                                                                               | `'https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F'`                                |

*All properties are optional.*

<!-- ZOD end -->
