# @stephansama/multipublish

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
