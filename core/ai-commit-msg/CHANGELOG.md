# @stephansama/ai-commit-msg

## 1.2.1

### Patch Changes

- a4e5072: point the `./schema.json` export and the top-level `types` field at `dist`. they referenced a `config/` folder that isn't published, so importing `@stephansama/ai-commit-msg/schema.json` failed. put the `types` condition first in `monorule`'s exports so typescript resolves it. `publint` now runs on every build, so a missing or misordered export fails the build. `loadRules` now declares its return type as `RuleMapSchema[string][]`, and `RuleMapSchema` is exported, so the published types stay the same from build to build

## 1.2.0

### Minor Changes

- d1a0572: add an `anthropic` provider. it reads `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_OAUTH_TOKEN`, or `ANTHROPIC_API_KEY` (in that order). also upgrade the tanstack ai adapters to 1.x, and change the default ollama model from `llama2` to `llama3.2`

## 1.1.0

### Minor Changes

- e7610a4: use the existing commit message as the intent for the generated message. empty or n/a-style messages are ignored, and custom prompts can use a `{{message}}` placeholder
- e7610a4: migrate from the vercel ai sdk to tanstack ai. the google provider now also accepts `GOOGLE_API_KEY` or `GEMINI_API_KEY`, and ollama respects `OLLAMA_HOST`. the `model` config option is now typed as the known adapter models or any other string, so editors can autocomplete model names

## 1.0.9

### Patch Changes

- fdf1800: updated auto-readme badge implementation

## 1.0.8

### Patch Changes

- ce47508: added cross agent skill to packages

## 1.0.7

### Patch Changes

- 7083cc6: added tsnapi snapshots to preserve api state

## 1.0.6

### Patch Changes

- 26e068d: updated eslint type aware implementation

## 1.0.5

### Patch Changes

- ee1d981: updated console rules and fixed conditions

## 1.0.4

### Patch Changes

- 4f78352: created eslint-config package

## 1.0.3

### Patch Changes

- 8bf5ceb: added socket and jsr badge to relevant packages

## 1.0.2

### Patch Changes

- 5d6ed23: switch from npmjs to npmx

## 1.0.1

### Patch Changes

- a307d76: updated dependencies

## 1.0.0

### Major Changes

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
