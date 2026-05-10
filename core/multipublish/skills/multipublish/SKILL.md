---
name: multipublish
description: >
  Publish monorepo packages simultaneously to npm and JSR via a platforms config
  array. Integrates with changesets via stdin pipe or --useChangesetStatus flag.
  Use experimentalGenerateJSR to skip maintaining a jsr.json. Supports pnpm, bun,
  npm, yarn (jsr and npm); deno (jsr only). Config via cosmiconfig or package.json
  multipublish key.
type: core
library: "@stephansama/multipublish"
library_version: "1.0.11"
sources:
  - stephansama/packages:core/multipublish/src/publish.ts
  - stephansama/packages:core/multipublish/src/jsr.ts
  - stephansama/packages:core/multipublish/src/schema.ts
  - stephansama/packages:core/multipublish/README.md
---

# multipublish

Publishes monorepo packages to multiple registries in a single step. Reads released package info from changesets and loops over configured platforms.

## Setup

```json
{
  "$schema": "./node_modules/@stephansama/multipublish/config/schema.json",
  "platforms": [
    ["jsr", { "experimentalGenerateJSR": true }],
    ["npm", { "tokenEnvironmentKey": "NODE_AUTH_TOKEN" }]
  ]
}
```

Place as `.multipublishrc.json`, `.config/multipublishrc.json`, or a `multipublish` key in `package.json`. See cosmiconfig docs for all supported filenames.

## Core Patterns

### Changeset-based release (GitHub Actions)

```yaml
- name: Create Changeset Release
  uses: changesets/action@v1
  id: changesets
  with:
    publish: pnpm run publish

- name: Publish to other registries
  if: steps.changesets.outputs.published == 'true'
  run: echo "${{ steps.changesets.outputs.publishedPackages }}" | multipublish
```

`changeset publish` output is piped into `multipublish` via stdin. The JSON array of published packages tells multipublish which packages to process and at which versions.

### Use --useChangesetStatus instead of stdin

```json
{
  "scripts": {
    "preversion": "multipublish --useChangesetStatus --versionJsr",
    "version": "changeset version"
  }
}
```

`--useChangesetStatus` reads which packages have pending (unreleased) changesets directly from the changeset state — without piping from `changeset publish`. Use it in `preversion` to update JSR config versions before the changeset version bump runs.

### GitHub npm registry with scoped token

```json
{
  "platforms": [
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

Set `packages: write` permission in the GitHub Actions workflow.

### Dry run

```sh
multipublish --dry
```

Runs the full flow but passes `--dry-run` to the underlying publish commands. Use to verify config without publishing.

## Common Mistakes

### CRITICAL No jsr.json/deno.json and experimentalGenerateJSR not enabled

Wrong:

```json
{ "platforms": [["jsr", {}]] }
```

Without a `jsr.json` or `deno.json` in the package directory, multipublish throws `"failed to load userJsr config file"` at publish time.

Correct:

```json
{ "platforms": [["jsr", { "experimentalGenerateJSR": true }]] }
```

`experimentalGenerateJSR: true` derives `jsr.json` content from `package.json` exports automatically, eliminating the need to maintain a separate file.

Source: `core/multipublish/src/publish.ts`, `core/multipublish/src/jsr.ts:loadConfig`

### HIGH experimentalUpdateCatalogs silently skips on non-pnpm/bun

Wrong:

```json
{ "platforms": [["jsr", { "experimentalUpdateCatalogs": true }]] }
```

In a yarn or npm workspace, this logs `console.error` and silently skips without converting `catalog:` refs.

Correct:

Use `experimentalUpdateCatalogs` only with pnpm or bun workspaces.

Source: `core/multipublish/src/publish.ts`

### HIGH npm .npmrc strategy fails without auth token env var

Wrong:

```json
{ "platforms": [["npm", { "registry": "https://npm.pkg.github.com" }]] }
```

The default strategy is `.npmrc`. It reads `process.env[tokenEnvironmentKey]` (default: `NODE_AUTH_TOKEN`). If the variable is not set, it throws `"no auth token provided"`.

Correct:

```yaml
# In GitHub Actions workflow
env:
  NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Source: `core/multipublish/src/publish.ts`

### MEDIUM Both deno.json and jsr.json present in package

Wrong:

```text
packages/my-pkg/
  deno.json
  jsr.json   ← both exist
```

`loadConfig` globs for `{deno,jsr}.json` and throws `"please only have one deno or jsr configuration file"`.

Correct:

Keep only one. Prefer `jsr.json` for new projects.

Source: `core/multipublish/src/jsr.ts:loadConfig`

### MEDIUM deno package manager used with npm platform

Wrong:

```json
{ "platforms": [["npm", {}]] }
```

In a deno workspace, `publishPlatform` detects deno as the package manager and throws `"deno is not supported for npm publish"`.

Correct:

Use only the `jsr` platform in deno projects.

Source: `core/multipublish/src/publish.ts`
