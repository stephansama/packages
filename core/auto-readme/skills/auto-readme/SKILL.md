---
name: auto-readme
description: >
  Auto-generate and update tables and lists in README files using HTML comment
  markers. Supports WORKSPACE (monorepo package tables), ACTION (GitHub Action
  inputs from action.yml), PKG (package.json dependency tables), ZOD (zod schema
  reference tables), BADGE (dependency badges plus auto discovered MCP servers
  from json configs and skills-lock.json skill links), USAGE actions. Run via CLI or as a pre-commit hook with
  --changes to process only modified READMEs.
type: core
library: "@stephansama/auto-readme"
library_version: "1.0.0"
sources:
  - stephansama/packages:core/auto-readme/src/comment.ts
  - stephansama/packages:core/auto-readme/src/data.ts
  - stephansama/packages:core/auto-readme/src/plugin.ts
  - stephansama/packages:core/auto-readme/src/schema.ts
  - stephansama/packages:core/auto-readme/src/utilities/mcp.ts
  - stephansama/packages:core/auto-readme/src/utilities/skills.ts
  - stephansama/packages:core/auto-readme/README.md
---

# auto-readme

Keeps README files up to date by replacing content between HTML comment markers. Run manually, in CI, or as a pre-commit hook.

## Comment syntax

```md
<!-- ACTION_TYPE [options] start -->
<!-- ACTION_TYPE end -->
```

Content between markers is replaced on every run. Markers must be paired — every `start` needs a matching `end`.

## Setup

```sh
pnpx @stephansama/auto-readme
```

Add configuration to `package.json`:

```json
{
  "auto-readme": {
    "disableEmojis": false,
    "onlyShowPublicPackages": true
  }
}
```

Or use a standalone config file (`.autoreadmerc.json`, `.config/autoreadmerc.ts`, `autoreadme.config.ts`, etc.).

Skip markdown files with `ignoreGlobs` (globs relative to the git root, also applied to `--changes`; `node_modules` is always ignored):

```json
{
  "auto-readme": {
    "ignoreGlobs": ["examples/**", "**/CHANGELOG.md"]
  }
}
```

## Core Patterns

### Monorepo workspace table

```md
<!-- WORKSPACE start -->
<!-- WORKSPACE end -->
```

Generates a table of all packages in the workspace with name, version badge, download badge, and description. Reads from the pnpm/npm workspace config.

### GitHub Action inputs table

```md
<!-- ACTION start -->
<!-- ACTION end -->
```

Place this comment in a README inside a directory that contains `action.yml` or `action.yaml`. Generates a table of action inputs with name, required, default, and description columns.

### Package.json dependency table

```md
<!-- PKG start -->
<!-- PKG end -->
```

Generates a table of dependencies and devDependencies from the nearest `package.json`. Pass `path=` to point to a different package.json:

```md
<!-- PKG path="../other-package" start -->
<!-- PKG end -->
```

### Zod schema reference table

```md
<!-- ZOD path="./src/schema.js" start -->
<!-- ZOD end -->
```

Generates a markdown reference table from the default export of the given file using `zod2md`. The `path=` parameter is required and must point to a file with a zod schema as its default export.

### Dependency badges with MCP servers and skills

```md
<!-- BADGE start -->
<!-- BADGE end -->
```

Generates shields.io badges for the dependencies in the nearest `package.json` (or `path=`). When an MCP configuration file (`.mcp.json`, `.claude-plugin/plugin.json`, `.cursor/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `.roo/mcp.json`, `.kiro/settings/mcp.json`, `.amazonq/mcp.json`, `opencode.json(c)` or `.zed/settings.json`; all found files are merged and the first listed wins on duplicate names. TOML/YAML configs such as `.codex/config.toml` and `.continue/config.yaml` are intentionally not read) or a `skills-lock.json` file exists in the same directory as the README, the zone also appends one badge per MCP server (logo only, no label; http servers link to the host of their url only, never the endpoint path, credentials or query string; `args`, `env` and `headers` are never rendered) and one badge per skill (Vercel logo, no label) linking to its `SKILL.md` at the installed `ref` (or `HEAD`) on GitHub. Groups with more than 8 badges are wrapped in a collapsed `<details>` block whose summary is a logo + name + count badge (override with `collapse=<n>` on the comment). Nothing needs to be enabled; opt out with `--skip-mcp` / `--skip-skills` on the comment, which also skips reading the files. A malformed file fails the run with an error naming the file.

### Pre-commit hook (changed files only)

```sh
# .husky/pre-commit
auto-readme --changes
```

`--changes` (`-g`) only processes README files that are modified in the current git changeset. Use in pre-commit hooks to avoid re-processing the entire repo on every commit.

## Common Mistakes

### HIGH ZOD action used with LIST format

Wrong:

```md
<!-- ZOD-LIST path="./src/schema.js" start -->
<!-- ZOD-LIST end -->
```

Correct:

```md
<!-- ZOD path="./src/schema.js" start -->
<!-- ZOD end -->
```

The ZOD action only supports TABLE format. Specifying LIST (e.g. `ZOD-LIST`) throws `"cannot display zod in list format"` at pipeline execution time.

Source: `core/auto-readme/src/data.ts`

### HIGH ZOD comment missing path= parameter

Wrong:

```md
<!-- ZOD start -->
<!-- ZOD end -->
```

Correct:

```md
<!-- ZOD path="./src/schema.js" start -->
<!-- ZOD end -->
```

The ZOD data loader requires `path=` to locate the schema file. Without it, auto-readme throws `"no path found for zod table at markdown file <file>"`.

Source: `core/auto-readme/src/data.ts`

### HIGH ACTION comment without action.yml in the same directory

Wrong:

```md
<!-- In docs/README.md, but no action.yml in docs/ -->
<!-- ACTION start -->
<!-- ACTION end -->
```

Correct:

```md
<!-- In the same directory as action.yml -->
<!-- ACTION start -->
<!-- ACTION end -->
```

The ACTION data loader looks for `action.yml` or `action.yaml` in the same directory as the README file. Place the ACTION comment in the README co-located with the action definition, or use PKG for dependency tables in other directories.

Source: `core/auto-readme/src/utilities/action.ts:loadActionYaml`

### MEDIUM Unclosed or mismatched comment markers

Wrong:

```md
<!-- WORKSPACE start -->

Some content

<!-- WORKSPACE start -->  ← second start, no end
```

Correct:

```md
<!-- WORKSPACE start -->
<!-- WORKSPACE end -->
```

The `remark-zone` processor requires matched `start`/`end` pairs. Unmatched or duplicated markers cause the zone transform to silently skip or corrupt the section without an error.

Source: `core/auto-readme/src/plugin.ts`
