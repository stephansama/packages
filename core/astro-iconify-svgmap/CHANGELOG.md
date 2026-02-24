# @stephansama/astro-iconify-svgmap

## 1.0.9

### Patch Changes

- 5d6ed23: switch from npmjs to npmx

## 1.0.8

### Patch Changes

- a307d76: updated dependencies

## 1.0.7

### Patch Changes

- 0b3df19: created ai-commit-msg package and integrated it with husky to generate commit messages using AI. This includes:
  - New `ai-commit-msg` package for generating commit messages using AI.
  - Integration with AI models (Google, OpenAI, Ollama) to generate commit messages based on staged diffs.
  - Configuration through `dotenvx`, `cosmiconfig`, `obug` for debugging, and `yargs` for CLI argument parsing.
  - New configuration file `.config/.aicommitmsgrc.json`.
  - Updated `.config/.cspell.json` with new words.
  - Updated `.gitignore` to include `core/ai-commit-msg/config`.
  - Updated `.husky/commit-msg` and `.husky/pre-commit` scripts with shebang.
  - New `.husky/prepare-commit-msg` hook for AI-generated commit messages.
  - `README.md` updated with `ai-commit-msg` package.
  - Minor updates to `astro-iconify-svgmap` (Vite plugin type error fix, hot update function).
  - Minor documentation updates in `auto-readme/README.md`.
  - `auto-readme/build.mjs` removed yaml schema generation.
  - `auto-readme/package.json` updated to use `catalog:` for `cosmiconfig`, `deepmerge`, `yargs`.
  - `catppuccin-xsl/package.json` updated dev scripts to use `tsx watch`.
  - Root `package.json` and `pnpm-lock.yaml` updated for new package and dependencies.
  - `pnpm-workspace.yaml` updated with new `cli` catalog and `zod`, `deepmerge`, `es-toolkit` in catalogs.

## 1.0.6

### Patch Changes

- 17e55fe: Updated developer experience and readmes

## 1.0.5

### Patch Changes

- 59750e2: migrated to tsdown

## 1.0.4

### Patch Changes

- 74e34e3: Added more plugins to auto readme. Removed patch dependencies.
  - updated package.jsons with new packages directory structure

## 1.0.3

### Patch Changes

- 70b013d: Created auto readme cli

## 1.0.2

### Patch Changes

- 9fa53a8: check export types for packages

## 1.0.1

### Patch Changes

- cf11d04: updated homepage, readme and favicon

## 1.0.0

### Major Changes

- 0725d0c: Migrated astro iconify svgmap integration
