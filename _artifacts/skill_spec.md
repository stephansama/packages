# @stephansama/packages — Skill Spec

A monorepo of 24+ focused developer-workflow packages under the `@stephansama` scope. Packages solve discrete problems: type-safe browser events, environment and template validation, ESLint configuration, AI commit messages, README automation, multi-registry publishing, and Astro SVG sprite maps. All packages are independent with no cross-package runtime dependencies.

## Domains

| Domain          | Description                                                            | Skills                                   |
| --------------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| standard-schema | Packages that wrap the standard-schema spec to add runtime type safety | typed-events, typed-env, typed-templates |
| workflow        | CLI tools that automate repetitive developer tasks via hooks or CI     | ai-commit-msg, auto-readme, multipublish |
| code-quality    | Composable ESLint flat config with auto-detection                      | eslint-config                            |
| framework       | Astro integration for optimised SVG sprite maps                        | astro-iconify-svgmap                     |

## Skill Inventory

| Skill                | Type      | Domain          | What it covers                                                    | Failure modes |
| -------------------- | --------- | --------------- | ----------------------------------------------------------------- | ------------- |
| typed-events         | core      | standard-schema | 5 event factories, React hooks, cleanup pattern                   | 6             |
| typed-env            | core      | standard-schema | createEnvironment, validate, generateExample                      | 3             |
| typed-templates      | core      | standard-schema | SchemaMap, Singleton, getFileContext, audit, compile              | 4             |
| eslint-config        | core      | code-quality    | 25+ configs, presets, autoEnable, overrides                       | 4             |
| multipublish         | core      | workflow        | JSR + npm publishing, changesets integration                      | 5             |
| auto-readme          | core      | workflow        | Comment markers, 5 actions, CLI flags, Git hook                   | 4             |
| ai-commit-msg        | core      | workflow        | 3 AI providers, Git hook, custom prompt, skipNextRun              | 4             |
| astro-iconify-svgmap | framework | framework       | createIntegration, virtual module import, @iconify-json discovery | 4             |

## Failure Mode Inventory

### typed-events (6 failure modes)

| #   | Mistake                                                                   | Priority | Source                       | Cross-skill? |
| --- | ------------------------------------------------------------------------- | -------- | ---------------------------- | ------------ |
| 1   | Async schema validator causes silent validation bypass                    | CRITICAL | src/utils/validate.ts        | —            |
| 2   | Forgetting to call the cleanup function from listen()                     | HIGH     | src/event.ts                 | —            |
| 3   | Using createEvent/createMessage in SSR without setting a target           | HIGH     | src/event.ts, src/message.ts | —            |
| 4   | Unstable listener reference in useListeners causes repeated registrations | HIGH     | src/react.ts                 | —            |
| 5   | Picking the wrong event primitive for the use case                        | HIGH     | README, src/                 | —            |
| 6   | Using a native DOM event name with createEvent                            | MEDIUM   | src/event.ts:Restrict        | —            |

### typed-env (3 failure modes)

| #   | Mistake                                                             | Priority | Source       | Cross-skill?    |
| --- | ------------------------------------------------------------------- | -------- | ------------ | --------------- |
| 1   | Using a schema library other than zod/valibot/arktype               | CRITICAL | src/index.ts | typed-templates |
| 2   | Not passing loadEnvironmentConfig and expecting dotenv to auto-load | HIGH     | src/index.ts | —               |
| 3   | validate() throws raw JSON with no context                          | MEDIUM   | src/index.ts | —               |

### typed-templates (4 failure modes)

| #   | Mistake                                                              | Priority | Source                       | Cross-skill? |
| --- | -------------------------------------------------------------------- | -------- | ---------------------------- | ------------ |
| 1   | Not using getFileContext(import.meta.url) for templateDirectory      | HIGH     | src/utilities.ts             | —            |
| 2   | Calling audit() on every import instead of guarding with isLinting() | HIGH     | src/utilities.ts             | —            |
| 3   | Using a schema library other than zod/valibot/arktype                | HIGH     | src/normalize.ts             | typed-env    |
| 4   | Confusing SchemaMap and Singleton use cases                          | MEDIUM   | src/map.ts, src/singleton.ts | —            |

### eslint-config (4 failure modes)

| #   | Mistake                                                     | Priority | Source                    | Cross-skill? |
| --- | ----------------------------------------------------------- | -------- | ------------------------- | ------------ |
| 1   | Not awaiting the async config function                      | HIGH     | src/builder.ts            | —            |
| 2   | pnpm config linting a non-pnpm workspace                    | HIGH     | src/presets.ts            | —            |
| 3   | typescript config requires tsconfig.json via projectService | HIGH     | src/configs/typescript.ts | —            |
| 4   | autoEnable silently enables configs for detected packages   | MEDIUM   | src/auto.ts               | —            |

### multipublish (5 failure modes)

| #   | Mistake                                                   | Priority | Source                     | Cross-skill? |
| --- | --------------------------------------------------------- | -------- | -------------------------- | ------------ |
| 1   | No jsr.json/deno.json and experimentalGenerateJSR not set | CRITICAL | src/publish.ts, src/jsr.ts | —            |
| 2   | experimentalUpdateCatalogs used with npm or yarn          | HIGH     | src/publish.ts             | —            |
| 3   | npm .npmrc strategy without auth token env var            | HIGH     | src/publish.ts             | —            |
| 4   | Having both deno.json and jsr.json in a package directory | MEDIUM   | src/jsr.ts                 | —            |
| 5   | Using deno as package manager for npm publishing          | MEDIUM   | src/publish.ts             | —            |

### auto-readme (4 failure modes)

| #   | Mistake                                                    | Priority | Source        | Cross-skill? |
| --- | ---------------------------------------------------------- | -------- | ------------- | ------------ |
| 1   | ZOD action with LIST format throws                         | HIGH     | src/data.ts   | —            |
| 2   | ZOD comment missing path= parameter                        | HIGH     | src/data.ts   | —            |
| 3   | ACTION comment without action.yml/action.yaml in directory | HIGH     | src/data.ts   | —            |
| 4   | Comment markers left unclosed or mismatched                | MEDIUM   | src/plugin.ts | —            |

### ai-commit-msg (4 failure modes)

| #   | Mistake                                                             | Priority | Source        | Cross-skill? |
| --- | ------------------------------------------------------------------- | -------- | ------------- | ------------ |
| 1   | Default config uses ollama/llama2 which fails if ollama not running | CRITICAL | src/config.ts | —            |
| 2   | Missing API key env var for non-ollama providers                    | HIGH     | src/ai.ts     | —            |
| 3   | Custom prompt without {{diff}} placeholder loses the diff           | HIGH     | src/index.ts  | —            |
| 4   | Running hook with no staged changes throws                          | MEDIUM   | src/index.ts  | —            |

### astro-iconify-svgmap (4 failure modes)

| #   | Mistake                                                      | Priority | Source                             | Cross-skill? |
| --- | ------------------------------------------------------------ | -------- | ---------------------------------- | ------------ |
| 1   | No @iconify-json/\* packages installed                       | CRITICAL | src/utilities.ts                   | —            |
| 2   | Not importing virtual:iconify-svgmap in base layout          | CRITICAL | src/index.ts, maintainer interview | —            |
| 3   | Using createPlugin directly instead of createIntegration     | HIGH     | src/index.ts                       | —            |
| 4   | Monorepo icon packs at root but iconifyRootDirectory not set | HIGH     | src/utilities.ts                   | —            |

## Tensions

| Tension                                                       | Skills                                     | Agent implication                                                              |
| ------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Synchronous validation requirement vs async schema ergonomics | typed-events ↔ typed-templates ↔ typed-env | Agent using async zod patterns produces code that silently bypasses validation |
| autoEnable convenience vs explicit config control             | eslint-config                              | Agent generates config unaware of which configs are auto-active                |
| Default ollama provider vs production AI providers            | ai-commit-msg                              | Agent setup works locally but fails in CI without explicit provider config     |

## Cross-References

| From            | To          | Reason                                                                 |
| --------------- | ----------- | ---------------------------------------------------------------------- |
| typed-events    | typed-env   | Same vendor restriction (zod/valibot/arktype); mistake applies to both |
| typed-templates | typed-env   | Same hard-coded vendor normalisation                                   |
| multipublish    | auto-readme | Both use cosmiconfig with similar naming conventions                   |
| ai-commit-msg   | auto-readme | Both wired as Git hooks; hook setup pattern transfers                  |

## Subsystems & Reference Candidates

| Skill         | Subsystems                                                                               | Reference candidates                     |
| ------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| typed-events  | createEvent, createEventMap, createBroadcastChannel, createBroadcastEvent, createMessage | —                                        |
| eslint-config | —                                                                                        | 25+ individual configs and their options |
| multipublish  | jsr platform, npm platform                                                               | —                                        |
| ai-commit-msg | google, openai, ollama providers                                                         | —                                        |

## Remaining Gaps

| Skill       | Question                                                                  | Status |
| ----------- | ------------------------------------------------------------------------- | ------ |
| auto-readme | What is the intended USAGE comment workflow vs enableUsage config option? | open   |

## Recommended Skill File Structure

- **Core skills:** typed-events, typed-env, typed-templates, eslint-config, multipublish, auto-readme, ai-commit-msg
- **Framework skills:** astro-iconify-svgmap
- **Lifecycle skills:** none identified
- **Composition skills:** none identified (packages are independent)
- **Reference files:** eslint-config (25+ config options warrant a reference file); typed-events (5 factories with distinct interfaces)

## Composition Opportunities

| Library                 | Integration points                                       | Composition skill needed?                            |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| zod / valibot / arktype | typed-events, typed-env, typed-templates all require one | No — standard-schema agnostic, mention in each skill |
| @iconify-json/\*        | astro-iconify-svgmap requires at least one installed     | No — prerequisite, not integration                   |
| changesets              | multipublish integrates with changeset publish output    | No — described within multipublish skill             |
| husky / lefthook        | ai-commit-msg and auto-readme both use Git hooks         | No — hook wiring described within each skill         |
