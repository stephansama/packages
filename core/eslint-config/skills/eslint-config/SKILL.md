---
name: eslint-config
description: >
  Composable ESLint flat config for TypeScript projects. Use config() with
  presets.base spread to activate baseline, javascript, typescript, imports,
  jsdoc, unicorn, perfectionist, prettier, regexp, command, packagejson, pnpm,
  gitignore, node, e18e configs. autoEnable detects installed packages (astro,
  svelte, lit, storybook, typescript, zod, prettier, vue). Returns Promise<Config[]>.
  Use overrides/overrides_prepend for project-specific rules.
type: core
library: "@stephansama/eslint-config"
library_version: "0.2.1"
sources:
  - stephansama/packages:core/eslint-config/src/builder.ts
  - stephansama/packages:core/eslint-config/src/auto.ts
  - stephansama/packages:core/eslint-config/src/presets.ts
  - stephansama/packages:core/eslint-config/src/types.ts
  - stephansama/packages:core/eslint-config/README.md
---

# eslint-config

Modular ESLint flat config with 25+ composable configs and auto-detection of installed packages. All configs are additive — pass `true` to enable or pass an options object to configure.

## Setup

```js
// eslint.config.js
import { config, presets } from "@stephansama/eslint-config";

export default config({
  ...presets.base,
});
```

`presets.base` includes: `baseline`, `command`, `e18e`, `ignore`, `imports`, `javascript`, `jsdoc`, `node`, `packagejson`, `perfectionist`, `pnpm`, `prettier`, `regexp`, `typescript`, `unicorn`.

`config()` returns `Promise<Config[]>` — valid as an ESLint v9 async default export.

## Core Patterns

### Library package configuration

```js
import { config, presets } from "@stephansama/eslint-config";

export default config({
  ...presets.base,
  ...presets.library, // packagejson with isLibrary: true
  vitest: true,
});
```

### Framework-specific config

```js
import { config, presets } from "@stephansama/eslint-config";

export default config({
  ...presets.base,
  astro: true, // auto-enabled if astro is installed
  svelte: true, // auto-enabled if svelte is installed
  vitest: true,
});
```

### Project-specific rule overrides

```js
import { config, presets } from "@stephansama/eslint-config";

export default config({
  ...presets.base,
  overrides: [
    {
      rules: {
        "unicorn/filename-case": "off",
      },
    },
  ],
  overrides_prepend: [
    {
      ignores: ["generated/**"],
    },
  ],
});
```

`overrides` is appended at the end. `overrides_prepend` is inserted at the start.

### Disable auto-detection

```js
export default config({
  ...presets.base,
  autoEnable: false, // only activate what you explicitly set
  typescript: true,
  prettier: true,
});
```

## Common Mistakes

### HIGH Config function not awaited in downstream tooling

Wrong:

```js
// Some build tools pass the export directly without awaiting
const result = config({ ...presets.base });
// result is a Promise, not Config[] — ESLint v9 handles this but other tools may not
```

Correct:

```js
// Explicit await if needed outside ESLint's native async config support
export default await config({ ...presets.base });
```

Several configs (`astro`, `svelte`, `json`, `markdown`, `css`) are async. `config()` always returns `Promise<Config[]>`. ESLint v9 flat config natively supports Promise-returning default exports, but other tools consuming the config may not.

Source: `core/eslint-config/src/builder.ts`

### HIGH pnpm config causes errors in non-pnpm projects

Wrong:

```js
// yarn or npm project
export default config({ ...presets.base });
// pnpm: true is in presets.base — enforces catalog: syntax on all version strings
```

Correct:

```js
export default config({ ...presets.base, pnpm: false });
```

`presets.base` includes `pnpm: true` which activates `eslint-plugin-pnpm`. It enforces `catalog:` version syntax and workspace settings. Disable it explicitly in non-pnpm projects.

Source: `core/eslint-config/src/presets.ts`

### HIGH typescript config requires tsconfig.json via projectService

Wrong:

```js
// No tsconfig.json at project root
export default config({ ...presets.base });
// typescript-eslint's projectService cannot find the project → errors on every file
```

Correct:

```js
export default config({
  ...presets.base,
  typescript: { project: "./tsconfig.json" },
});
```

The `typescript` config uses `typescript-eslint` with `projectService`. It discovers `tsconfig.json` automatically, but files outside any tsconfig path produce "file not included in any project" errors. Pass `project` explicitly in monorepos or non-standard layouts.

Source: `core/eslint-config/src/configs/typescript.ts`

### MEDIUM autoEnable silently activates configs for detected packages

Wrong:

```js
// zod is installed; agent writes config unaware that zod rules are active
export default config({ ...presets.base });
// zod: true is silently enabled by autoEnable
```

Correct:

```js
// Be explicit or disable autoEnable to see exactly what is active
export default config({ ...presets.base, autoEnable: false, zod: true });
```

`autoEnable: true` (default) checks `node_modules` for `astro`, `svelte`, `vue`/`nuxt`/`vitepress`, `lit`, `storybook`, `prettier`, `typescript`, `zod` and enables the corresponding config. The final active config is not visible from the config file alone.

Source: `core/eslint-config/src/auto.ts:autoEnableMap`

## References

- [All individual config options](references/configs.md)
