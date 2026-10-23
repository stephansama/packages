<div align="center">

# [`@stephansama`](https://github.com/stephansama) / auto-readme

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/auto-readme)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/auto-readme)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/auto-readme)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/auto-readme)](https://socket.dev/npm/package/@stephansama/auto-readme/overview)
[![jsr](https://jsr.io/badges/@stephansama/auto-readme)](https://jsr.io/@stephansama/auto-readme)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/auto-readme)

[![handlebars](https://img.shields.io/badge/handlebars-4.7.9-d46926.svg?logo=handlebarsdotjs&logoColor=ffffff&labelColor=d46926)](https://npmx.dev/package/handlebars)
[![remark](https://img.shields.io/badge/remark-15.0.1-000000.svg?logo=remark&logoColor=ffffff&labelColor=000000)](https://npmx.dev/package/remark)
[![simple-icons](https://img.shields.io/badge/simple--icons-16.19.0-111111.svg?logo=simpleicons&logoColor=ffffff&labelColor=111111)](https://npmx.dev/package/simple-icons)
[![yaml](https://img.shields.io/badge/yaml-2.8.2-CB171E.svg?logo=yaml&logoColor=ffffff&labelColor=CB171E)](https://npmx.dev/package/yaml)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

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
  - [Ignoring files](#ignoring-files)
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

To generate badges for your dependencies add the following comments

```md
<!-- BADGE start -->
<!-- BADGE end -->
```

If an MCP configuration file or a `skills-lock.json` file lives next to the `README`, the badge section automatically adds a badge for every MCP server and a badge linking to every skill underneath the dependency badges. MCP badges show only the MCP logo next to the server name and link to the host of the server `url` (scheme and domain only, never the endpoint path, credentials or query string); `args`, `env` and `headers` are never rendered. Skill badges show only the Vercel logo (the lock file is written by Vercel's `skills` CLI) next to the skill name and link to the `SKILL.md` at the installed `ref` (or `HEAD`).

The following MCP configuration files are discovered relative to the `README`. Every file found is merged, and when a server name repeats the file listed first wins:

| File                         | Tool                     |
| :--------------------------- | :----------------------- |
| `.mcp.json`                  | Claude Code              |
| `.claude-plugin/plugin.json` | Claude Code plugins      |
| `.cursor/mcp.json`           | Cursor                   |
| `.vscode/mcp.json`           | VS Code / GitHub Copilot |
| `.gemini/settings.json`      | Gemini CLI               |
| `.roo/mcp.json`              | Roo Code                 |
| `.kiro/settings/mcp.json`    | Kiro                     |
| `.amazonq/mcp.json`          | Amazon Q Developer       |
| `opencode.json` / `.jsonc`   | OpenCode                 |
| `.zed/settings.json`         | Zed                      |

> [!NOTE]
> Only JSON based configuration files are read. TOML based files such as `.codex/config.toml` (OpenAI Codex) and YAML based files such as `.continue/config.yaml` (Continue) are intentionally not supported.

A group with more than 8 badges is wrapped in a collapsed `<details>` block whose summary is a badge showing the group logo, name and count. Change the threshold with `collapse=<n>` on the comment:

```md
<!-- BADGE collapse=20 start -->
<!-- BADGE end -->
```

Pass `--skip-mcp` or `--skip-skills` on the comment to opt out:

```md
<!-- BADGE --skip-mcp --skip-skills start -->
<!-- BADGE end -->
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

`auto-readme` can be configured using a variety of files, such as `package.json` with an `autoreadme` property, or a standalone `.autoreadmerc` file. For more information on configuration files, see [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig).

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
/** @type {import("@stephansama/auto-readme").Config} */
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

### Ignoring files

Use `ignoreGlobs` to skip markdown files. Globs are matched relative to the git root and are also applied when running with `--changes`. `node_modules` is always ignored.

```json
{
  "ignoreGlobs": ["examples/**", "**/CHANGELOG.md"]
}
```

The same option is available on the cli with `--ignoreGlobs` / `-i`. Quote each glob so the shell does not expand it (`-i "examples/**"`).

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
- `'BADGE'`

## BadgeDependencyTypeOptions

_Array of `'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'` items._

_Default value:_ `["dependencies","devDependencies"]`

## Config

_Object containing the following properties:_

| Property                    | Description                                                                                | Type                                                                                                                                                                                                                                                                                                                                                                                                      | Default                                                                                                                                                                                                                                                                                                                                                                                        |
| :-------------------------- | :----------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`affectedRegexes`** (\*)  |                                                                                            | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                |
| `badgeOptions`              |                                                                                            | _Object with properties:_<ul><li>`dependencyTypes`: [BadgeDependencyTypeOptions](#badgedependencytypeoptions)</li><li>`templates`: _Array of objects:_<br /><ul><li>**`image`** (\*): `string`</li><li>**`label`** (\*): `string`</li><li>**`url`** (\*): `string`</li></ul> - handlebar template strings where {{scope}}, {{name}} / {{key}} and {{version}} / {{value}} represent the package</li></ul> | `{"dependencyTypes":["dependencies","devDependencies"],"templates":[]}`                                                                                                                                                                                                                                                                                                                        |
| **`collapseHeadings`** (\*) |                                                                                            | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                |
| `defaultLanguage`           | Default language to infer projects from                                                    | [Language](#language)                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                |
| `disableEmojis`             | Whether or not to use emojis in markdown table headings                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `disableMarkdownHeadings`   | Whether or not to display markdown headings                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `enablePrettier`            | Whether or not to use prettier to format the files                                         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `true`                                                                                                                                                                                                                                                                                                                                                                                         |
| `enableToc`                 | generate table of contents for readmes                                                     | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `enableUsage`               | Whether or not to enable usage plugin                                                      | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `headings`                  | List of headings for different table outputs                                               | _Object with dynamic keys of type_ [Actions](#actions) _and values of type_ `Array<'default' \| 'description' \| 'devDependency' \| 'downloads' \| 'name' \| 'private' \| 'required' \| 'version'>` (_optional_)                                                                                                                                                                                          | `{"ACTION":["name","required","default","description"],"BADGE":[],"PKG":["name","version","devDependency"],"USAGE":[],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`                                                                                                                                                                                                      |
| `ignoreGlobs`               | Globs relative to the git root of markdown files to skip (node\_modules is always ignored) | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                                           |
| `onlyReadmes`               | Whether or not to only traverse readmes                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `true`                                                                                                                                                                                                                                                                                                                                                                                         |
| `onlyShowPublicPackages`    | Only show public packages in workspaces                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `removeScope`               | Remove common workspace scope                                                              | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `''`                                                                                                                                                                                                                                                                                                                                                                                           |
| `templates`                 | Handlebars templates used to fuel list and table generation                                | _Object with properties:_<ul><li>`downloadImage`: `string`</li><li>`emojis`: `Record<'default' \| 'description' \| 'devDependency' \| 'downloads' \| 'name' \| 'private' \| 'required' \| 'version', string>` - Table heading emojis used when enabled</li><li>`registryUrl`: `string`</li><li>`versionImage`: `string`</li></ul>                                                                         | `{"downloadImage":"https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F","emojis":{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""},"registryUrl":"https://www.npmx.dev/package/{{name}}","versionImage":"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"}` |
| `tocHeading`                | Markdown heading used to generate table of contents                                        | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `'Table of contents'`                                                                                                                                                                                                                                                                                                                                                                          |
| `usageFile`                 | Workspace level usage file                                                                 | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `''`                                                                                                                                                                                                                                                                                                                                                                                           |
| `usageHeading`              | Markdown heading used to generate usage example                                            | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `'Usage'`                                                                                                                                                                                                                                                                                                                                                                                      |
| `verbose`                   | whether or not to display verbose logging                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |

_(\*) Required._ (_optional_)

## Formats

_Enum, one of the following possible values:_

- `'LIST'`
- `'TABLE'`

_Default value:_ `'TABLE'`

## Language

_Enum, one of the following possible values:_

- `'JS'`
- `'RS'`

_Default value:_ `'JS'`

<!-- ZOD end -->
