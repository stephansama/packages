<div align="center">

# [`@stephansama`](https://github.com/stephansama) / ai-commit-msg

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/ai-commit-msg)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/ai-commit-msg)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fai-commit-msg?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/ai-commit-msg)](https://socket.dev/npm/package/@stephansama/ai-commit-msg/overview)
[![jsr](https://jsr.io/badges/@stephansama/ai-commit-msg)](https://jsr.io/@stephansama/ai-commit-msg)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/ai-commit-msg?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/ai-commit-msg)

[![@dotenvx/dotenvx](https://img.shields.io/badge/@dotenvx/dotenvx-1.52.0-ECD53F.svg?logo=dotenv&logoColor=ffffff&labelColor=ECD53F)](https://npmx.dev/package/@dotenvx/dotenvx)
[![@tanstack/ai](https://img.shields.io/badge/@tanstack/ai-1.2.0-f6339a.svg?logo=@tanstack/ai&logoColor=ffffff&labelColor=f6339a)](https://npmx.dev/package/@tanstack/ai)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

generate commit messages using ai

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [CLI Options](#cli-options)
- [Usage](#usage)
  - [Husky](#husky)
  - [Lefthook](#lefthook)
  - [Preserving your commit message](#preserving-your-commit-message)

</details>

## Installation

```sh
pnpm install @stephansama/ai-commit-msg
```

## CLI Options

| Option      | Alias | Description                | Type      |
| :---------- | :---- | :------------------------- | :-------- |
| `--config`  | `-c`  | Path to config file        | `string`  |
| `--output`  | `-o`  | Output file for commit-msg | `string`  |
| `--verbose` | `-v`  | Enable verbose logging     | `boolean` |

## Usage

```typescript
import type { Config } from "@stephansama/ai-commit-msg/schema";
```

Save a config file as `ai-commit-msg.config.ts` in the project root (any
cosmiconfig location works, e.g. an `ai-commit-msg` key in `package.json`):

```typescript
export default {
  model: "claude-opus-5-5",
  provider: "anthropic",
} satisfies Config;
```

Then set the API key for the provider. Anthropic reads
`ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_OAUTH_TOKEN`, or `ANTHROPIC_API_KEY`.

The CLI writes the generated message to the file passed with `-o`. Run it
from the `prepare-commit-msg` git hook, which receives the commit message
file as its first argument.

### Husky

Install and initialize husky with
`pnpm add -D husky && pnpm exec husky init`, then create
`.husky/prepare-commit-msg`:

```sh
#!/bin/sh

ai-commit-msg -o "$1"
```

### Lefthook

Install lefthook with `pnpm add -D lefthook`, add the hook to `lefthook.yml`
(`{1}` is the first git hook argument, the commit message file), then run
`pnpm exec lefthook install`:

```yaml
prepare-commit-msg:
  jobs:
    - run: pnpm exec ai-commit-msg -o {1}
```

### Preserving your commit message

If the output file already contains a message (for example from
`git commit -m "fix login redirect"`), it is passed to the model as the
original intent. The message is then rewritten to match the prompt's format
and the staged diff, without changing what it means.

Git comment lines (`#`) and verbose diff output are ignored. A message that
is empty, punctuation only, or a variant of `n/a` (`N/A`, `na`, `n.a.`,
`none`) is treated as no message, and a fresh one is generated from the diff.

A custom `prompt` can place the existing message with the `{{message}}`
placeholder. Without the placeholder, intent instructions are appended to the
prompt when a message exists.
