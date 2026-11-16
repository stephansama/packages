<div align="center">

# [`@stephansama`](https://github.com/stephansama) / find-floating-deps

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/find-floating-deps)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/find-floating-deps)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ffind-floating-deps?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/find-floating-deps)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/find-floating-deps)](https://socket.dev/npm/package/@stephansama/find-floating-deps/overview)
[![jsr](https://jsr.io/badges/@stephansama/find-floating-deps)](https://jsr.io/@stephansama/find-floating-deps)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/find-floating-deps?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/find-floating-deps)

[![yaml](https://img.shields.io/badge/yaml-2.8.2-CB171E.svg?logo=yaml&logoColor=ffffff&labelColor=CB171E)](https://npmx.dev/package/yaml)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

Reports every **floating** dependency in an installed pnpm tree. A floating dependency is a range that can resolve to a newer version than the one installed today: `*`, `latest`, `^1.2.3`, `~1.2.3`, `>=1.2.3`, `1.x` and so on.

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [What counts as floating](#what-counts-as-floating)
- [Output formats](#output-formats)
- [Fields](#fields)
- [Options](#options)
- [Exit codes](#exit-codes)

</details>

## Installation

```sh
pnpm install --save-dev @stephansama/find-floating-deps
```

Or run it once with `pnpm dlx @stephansama/find-floating-deps`.

## Usage

```sh
find-floating-deps                    # table on a TTY
find-floating-deps --format csv > floating.csv
find-floating-deps -1 | xargs -n1 pnpm why -r
find-floating-deps --kind wildcard --fail-on wildcard   # CI gate
find-floating-deps --exclude '@types/*' --dep-types all
```

It scans your workspace manifests and every package in `node_modules/.pnpm`, so run `pnpm install` first. Each `name@version` is checked once. Pass `--workspace-only` to check only your own manifests.

## What counts as floating

| `kind`         | Examples                     |
| -------------- | ---------------------------- |
| `wildcard`     | `*`, `x`, empty              |
| `tag`          | `latest`, `next`             |
| `caret`        | `^1.2.3`                     |
| `tilde`        | `~1.2.3`                     |
| `comparison`   | `>=1.2.3`, `>1`, `<2`, `<=2` |
| `hyphen`       | `1.2.3 - 2.0.0`              |
| `x-range`      | `1.x`, `1.2.x`               |
| `partial`      | `^1.2`, `1`                  |
| `union`        | `^1.0.0 \|\| ^2.0.0`         |
| `intersection` | `>=1.2.3 <2.0.0`             |

Exact versions and protocols (`workspace:`, `file:`, `link:`, git, tarballs) never float. `npm:` aliases are classified by their range.

`catalog:` and `catalog:<name>` specs in your workspace manifests are classified by the range the catalog holds in `pnpm-workspace.yaml`. Their `spec` is that range and `catalog` names the catalog. They're never `pinnable`, because `pinAllDependencies` sees `catalog:`, not the range. Published packages already have real ranges in place of `catalog:`.

## Output formats

Pick one with `--format <name>`. Without it, you get `table` on a TTY and `tsv` when piped.

| Format     | Shorthand | Use                                                                                                      |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `table`    |           | Aligned, colored columns with a totals line                                                              |
| `list`     | `-1`      | One unique dependency name per line, for `xargs` and `pnpm why`                                          |
| `tsv`      |           | Full rows, easy to `cut`, `sort` or `awk`                                                                |
| `csv`      | `--csv`   | Spreadsheets, with RFC 4180 quoting                                                                      |
| `json`     | `--json`  | `{ "findings": [...], "summary": {...} }`                                                                |
| `jsonl`    |           | One finding per line (`ndjson` works too). Streams into `jq`                                             |
| `markdown` |           | GitHub-flavored table for PR comments and READMEs                                                        |
| `summary`  |           | Counts only, by `kind` and `depType`                                                                     |
| `github`   |           | `::warning` workflow annotations, plus a markdown table appended to `$GITHUB_STEP_SUMMARY` when it's set |

`-o, --output <file>` writes to a file and picks the format from its extension (`.csv`, `.tsv`, `.json`, `.jsonl`, `.md`) unless `--format` is given. Unknown extensions get `tsv`.

## Fields

One row per (parent, dependency) pair:

| Field           | Example                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `parent`        | `@types/ws`                                                                                             |
| `parentVersion` | `8.18.1`                                                                                                |
| `dependency`    | `@types/node`                                                                                           |
| `spec`          | `*`                                                                                                     |
| `depType`       | `dependencies`                                                                                          |
| `kind`          | `wildcard`                                                                                              |
| `resolved`      | `24.12.2`, the version it is installed as, when it is installed                                         |
| `pinnable`      | `false`, whether [`pinAllDependencies`](../pnpm-hooks/README.md) from `@stephansama/pnpm-hooks` pins it |
| `catalog`       | `cli`, the pnpm catalog the range came from, for `catalog:` specs                                       |

Choose and order columns in `table`, `tsv`, `csv` and `markdown` with `--fields parent,dependency,spec`.

## Options

| Flag                  | Description                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `[dir]`               | Project root. Defaults to the current directory                                                                                         |
| `--dep-types <types>` | `dependencies`, `optionalDependencies`, `peerDependencies`, `devDependencies` or `all`. Defaults to `dependencies,optionalDependencies` |
| `--kind <kinds>`      | Keep only these kinds, e.g. `--kind wildcard,tag`                                                                                       |
| `--include <globs>`   | Keep findings whose parent or dependency matches                                                                                        |
| `--exclude <globs>`   | Drop findings whose parent or dependency matches, e.g. `--exclude '@types/*'`                                                           |
| `--workspace-only`    | Check only workspace manifests, not third-party packages                                                                                |
| `--sort <field>`      | Sort by any field. Defaults to `dependency`                                                                                             |
| `--fail-on <kinds>`   | Exit `1` when any finding has one of these kinds, or `all`                                                                              |
| `--fields <fields>`   | Columns for tabular formats                                                                                                             |
| `--no-header`         | Omit the header row from `csv`, `tsv` and `markdown`                                                                                    |
| `--no-color`          | Disable colors. `NO_COLOR` is respected too                                                                                             |
| `-o, --output <file>` | Write to a file instead of stdout                                                                                                       |

List flags accept commas, repeats, or both: `--kind wildcard,tag --kind caret`.

Peer and dev dependencies are opt-in because peers resolve against the consumer and pnpm never installs third-party `devDependencies`.

## Exit codes

| Code | Meaning                                                                     |
| ---- | --------------------------------------------------------------------------- |
| `0`  | No finding matched `--fail-on`                                              |
| `1`  | At least one finding matched `--fail-on`                                    |
| `2`  | Usage error (including an unknown flag), or the project couldn't be scanned |
