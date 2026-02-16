# @stephansama/auto-readme

## 0.2.5

### Patch Changes

- a307d76: updated dependencies

## 0.2.4

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

## 0.2.3

### Patch Changes

- 17e55fe: Updated developer experience and readmes

## 0.2.2

### Patch Changes

- 59750e2: migrated to tsdown

## 0.2.1

### Patch Changes

- 291f5a6: added option to enable/disable prettier in auto-readme

## 0.2.0

### Minor Changes

- 74e34e3: Added more plugins to auto readme. Removed patch dependencies.
  - updated package.jsons with new packages directory structure

## 0.1.1

### Patch Changes

- efc83fe: added support for toml. added prettier format before git stage

## 0.1.0

### Minor Changes

- 70b013d: Created auto readme cli
