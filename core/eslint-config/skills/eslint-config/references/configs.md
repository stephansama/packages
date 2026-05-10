# eslint-config — Individual Configs Reference

All configs are passed as keys to `config()`. Pass `true` to enable with defaults, or an options object to configure.

## Core configs (in presets.base)

| Config          | Plugin                                                          | Notes                                                                      |
| --------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `baseline`      | `eslint-plugin-baseline-js`                                     | Enforces Baseline-widely-available web features                            |
| `javascript`    | `@eslint/js`                                                    | Recommended JS rules; browser/node globals, JSX, ES2021                    |
| `typescript`    | `typescript-eslint`                                             | Type-checked rules via `projectService`; accepts `{ project: string }`     |
| `e18e`          | `@e18e/eslint-plugin`                                           | Modern API preferences (`Object.hasOwn`, nullish coalescing)               |
| `imports`       | `eslint-plugin-import-x`                                        | Import ordering and TypeScript resolver                                    |
| `jsdoc`         | `eslint-plugin-jsdoc`                                           | JSDoc validation; `require-jsdoc` disabled                                 |
| `unicorn`       | `eslint-plugin-unicorn`                                         | Opinionated best practices                                                 |
| `perfectionist` | `eslint-plugin-perfectionist`                                   | Natural-sort imports, exports, object keys                                 |
| `prettier`      | `eslint-plugin-prettier`                                        | Prettier formatting as ESLint warnings; auto-enabled if prettier installed |
| `regexp`        | `eslint-plugin-regexp`                                          | Regex best practices                                                       |
| `command`       | `eslint-plugin-command`                                         | Magic comment commands (`// @keep-sorted`)                                 |
| `packagejson`   | `eslint-plugin-package-json`, `eslint-plugin-node-dependencies` | Validates `package.json`; `{ isLibrary: true }` adds sort rules            |
| `pnpm`          | `eslint-plugin-pnpm`                                            | Enforces pnpm catalog usage; disable in non-pnpm projects                  |
| `ignore`        | `eslint-config-flat-gitignore`                                  | Applies `.gitignore` patterns as ESLint ignores                            |
| `node`          | `eslint-plugin-n`                                               | Node.js recommended rules                                                  |

## Framework configs (auto-detected or explicit)

| Config      | Plugin                    | Auto-detected when                      | Notes                                                                   |
| ----------- | ------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| `astro`     | `eslint-plugin-astro`     | `astro` installed                       | Recommended + jsx-a11y-strict; `{ disableA11yStrict: true }` to opt out |
| `svelte`    | `eslint-plugin-svelte`    | `svelte` installed                      | With TypeScript parser                                                  |
| `vue`       | —                         | `vue`, `nuxt`, or `vitepress` installed | Placeholder (empty config)                                              |
| `lit`       | `eslint-plugin-lit`       | `lit` installed                         | Attribute names, binding positions, lifecycle                           |
| `storybook` | `eslint-plugin-storybook` | `storybook` installed                   | Flat/recommended                                                        |

## Testing & validation configs

| Config   | Plugin                  | Notes                                                                              |
| -------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `vitest` | `@vitest/eslint-plugin` | Applied to `**/*.test.{ts,js}`; `{ typeAware: false }` to disable type-aware rules |
| `zod`    | `eslint-plugin-zod`     | Zod schema best practices; auto-enabled if zod installed                           |

## File format configs (async)

| Config     | Plugin                | Notes                                                           |
| ---------- | --------------------- | --------------------------------------------------------------- |
| `json`     | `eslint-plugin-jsonc` | JSON/JSONC linting                                              |
| `markdown` | `@eslint/markdown`    | Markdown code block linting; noisy rules disabled inside fences |
| `css`      | `@eslint/css`         | Font fallbacks, selector complexity, layers                     |

## Presets

| Preset            | Contents                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `presets.base`    | `baseline`, `command`, `e18e`, `ignore`, `imports`, `javascript`, `jsdoc`, `node`, `packagejson`, `perfectionist`, `pnpm`, `prettier`, `regexp`, `typescript`, `unicorn` |
| `presets.zod`     | `zod: true`                                                                                                                                                              |
| `presets.library` | `packagejson: { isLibrary: true }`                                                                                                                                       |

## BuilderOptions

| Option              | Type       | Default | Description                                             |
| ------------------- | ---------- | ------- | ------------------------------------------------------- |
| `autoEnable`        | `boolean`  | `true`  | Auto-detect installed packages and enable their configs |
| `overrides`         | `Config[]` | `[]`    | Appended to the end of the final config array           |
| `overrides_prepend` | `Config[]` | `[]`    | Prepended to the start of the final config array        |
