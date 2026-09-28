# @stephansama/multipublish

## 1.0.14

### Patch Changes

- 1ad2f1e: fix jsr transformer crash on any package.json whose conditional `exports` use conditions other than `import` / `require` (e.g. `svelte`, `types`-only entries, `default`-only entries, or nested conditions). The schema now accepts arbitrary recursive conditional exports and the transformer picks the first resolvable runtime path - preferring `import` / `module` / `default` / `node` / `browser` / `require` (esm-first, since jsr is esm-only), falling back to any non-`types` string - and drops entries with no runtime path so `types`-only sub-exports no longer break `experimentalGenerateJSR`. Top-level condition sugar (an `exports` object with no `.`-prefixed keys) is now treated as the `.` entry

## 1.0.13

### Patch Changes

- fdf1800: updated auto-readme badge implementation

## 1.0.12

### Patch Changes

- ce47508: added cross agent skill to packages

## 1.0.11

### Patch Changes

- 7083cc6: added tsnapi snapshots to preserve api state

## 1.0.10

### Patch Changes

- 26e068d: updated eslint type aware implementation

## 1.0.9

### Patch Changes

- 4f78352: created eslint-config package

## 1.0.8

### Patch Changes

- 8bf5ceb: added socket and jsr badge to relevant packages

## 1.0.7

### Patch Changes

- 45af1b2: Updated jsr to have auth token. fail without error for unscoped packages

## 1.0.6

### Patch Changes

- 5d6ed23: switch from npmjs to npmx

## 1.0.5

### Patch Changes

- a307d76: updated dependencies

## 1.0.4

### Patch Changes

- a4521b3: update multipublish configuration

## 1.0.3

### Patch Changes

- ac9320c: Updated multipublish workflow

## 1.0.2

### Patch Changes

- 40108ca: fix: update json parse for stdin

## 1.0.1

### Patch Changes

- 8f18a95: arbitrary bump to trigger publish

## 1.0.0

### Major Changes

- 635cec4: Initial release of `@stephansama/multipublish`, a CLI tool for publishing packages to multiple registries.

  Features:
  - **npm Publishing Strategies**: Supports two strategies for publishing to npm registries:
    - `.npmrc` strategy: Temporarily creates or updates a root-level `.npmrc` file with registry and auth token details.
    - `package.json` strategy: Directly sets the `publishConfig.registry` field in the package's `package.json`.
  - **JSR Support**: Automatically updates the `version` field in `jsr.json` before publishing.
  - **Configuration**: fully configurable via a schema using zod.
