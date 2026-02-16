# @stephansama/catppuccin-xsl

## 1.1.2

### Patch Changes

- a307d76: updated dependencies

## 1.1.1

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

## 1.1.0

### Minor Changes

- 3178be6: updated catppuccin-xsl implementation using typed-templates. updated small fixes for typed-templates

## 1.0.0

### Major Changes

- 7bd975f: Consolidated multiple xsl stylesheets into one package
