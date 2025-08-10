# @stephansama/auto-readme

[![Source code](https://img.shields.io/badge/Source-666666?style=flat\&logo=github\&label=Github\&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/packages/auto-readme)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat\&logo=Wikibooks\&labelColor=211F1F)](https://packages.stephansama.info/modules/_stephansama_auto-readme)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm\&logoColor=red\&color=211F1F\&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/auto-readme)

Generate lists and tables for your README automagically based on your repository

## Installation

```sh
pnpm install @stephansama/auto-readme
```

<!-- ZOD path="./src/schema.js" start -->

# Zod Schema

## Actions

Comment action options

*Enum, one of the following possible values:*

* `'ACTION'`
* `'PKG'`
* `'WORKSPACE'`
* `'ZOD'`

## Config

*Object containing the following properties:*

| Property                 | Description                                                 | Type                                                                                                                                                                                                                                                                                    | Default                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------------------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `affectedRegexes`        |                                                             | `Array<string>`                                                                                                                                                                                                                                                                         | `[]`                                                                                                                                                                                                                                                                                                                                                                                             |
| `defaultLanguage`        | Default language to infer projects from                     | [Language](#language)                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                  |
| `disableEmojis`          | Whether or not to use emojis in markdown table headings     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `headings`               | List of headings for different table outputs                | *Object with dynamic keys of type* [Actions](#actions) *and values of type* *Array of [Headings](#headings) items* (*optional*)                                                                                                                                                         | `{"ACTION":["name","required","default","description"],"PKG":["name","version","devDependency"],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`                                                                                                                                                                                                                              |
| `onlyReadmes`            | Whether or not to only traverse readmes                     | `boolean`                                                                                                                                                                                                                                                                               | `true`                                                                                                                                                                                                                                                                                                                                                                                           |
| `onlyShowPublicPackages` | Only show public packages in workspaces                     | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |
| `templates`              | Handlebars templates used to fuel list and table generation | *Object with properties:*<ul><li>`downloadImage`: `string`</li><li>`emojis`: *Object with dynamic keys of type* [Headings](#headings) *and values of type* `string` - Table heading emojis used when enabled</li><li>`registryUrl`: `string`</li><li>`versionImage`: `string`</li></ul> | `{"downloadImage":"https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F","emojis":{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""},"registryUrl":"https://www.npmjs.com/package/{{name}}","versionImage":"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"}` |
| `verbose`                | whether or not to display verbose logging                   | `boolean`                                                                                                                                                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                                                          |

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
