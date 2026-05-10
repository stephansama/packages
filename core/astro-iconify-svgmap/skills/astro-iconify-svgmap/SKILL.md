---
name: astro-iconify-svgmap
description: >
  Astro integration that generates optimized SVG sprite maps from @iconify-json/*
  icon packs for SSG sites. Add createIntegration() to astro.config.mjs, import
  virtual:iconify-svgmap in your base layout to activate the plugin, then call
  getIcon(pack, name) in .astro components to register icons and get <use> hrefs.
  Use iconifyRootDirectory for monorepos where node_modules is not at the project root.
type: framework
requires:
  - astro
library: "@stephansama/astro-iconify-svgmap"
library_version: "1.0.14"
sources:
  - stephansama/packages:core/astro-iconify-svgmap/src/index.ts
  - stephansama/packages:core/astro-iconify-svgmap/src/get.ts
  - stephansama/packages:core/astro-iconify-svgmap/src/type.ts
  - stephansama/packages:core/astro-iconify-svgmap/src/const.ts
---

# astro-iconify-svgmap

Generates SVG sprite maps from Iconify icon packs at build time and serves them during dev. Icons are registered lazily via `getIcon()` and assembled into per-pack sprite files.

## Setup

1. Install the integration and at least one `@iconify-json/*` pack:

```sh
pnpm add @stephansama/astro-iconify-svgmap @iconify-json/mdi
```

2. Add to `astro.config.mjs`:

```js
import { createIntegration } from "@stephansama/astro-iconify-svgmap";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [createIntegration()],
});
```

3. Import the virtual module in your base layout (this activates the Vite plugin):

```astro
---
// src/layouts/BaseLayout.astro
import "virtual:iconify-svgmap";
---
```

4. Use icons in any `.astro` component:

```astro
---
import { getIcon } from "@stephansama/astro-iconify-svgmap/get";

const iconHref = await getIcon("mdi", "home");
---

<svg width="24" height="24">
  <use href={iconHref}></use>
</svg>
```

## Core Patterns

### Basic icon rendering

```astro
---
import { getIcon } from "@stephansama/astro-iconify-svgmap/get";

const href = await getIcon("mdi", "account");
---

<svg width="24" height="24" aria-hidden="true">
  <use href={href}></use>
</svg>
```

`getIcon(pack, name)` returns `/<pack>.svg#<name>` — a fragment reference into the generated sprite. On the server it also registers the icon in the usage tracking file so the build step knows to include it in the sprite.

### Monorepo setup with iconifyRootDirectory

```js
// astro.config.mjs — inside a pnpm monorepo where icons are in the workspace root
import { createIntegration } from "@stephansama/astro-iconify-svgmap";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    createIntegration({
      iconifyRootDirectory: new URL("../../", import.meta.url),
    }),
  ],
});
```

`iconifyRootDirectory` is a `URL` pointing to the directory whose `node_modules` contains the `@iconify-json/*` packages. Defaults to the Astro project root.

### Custom output directory

```js
createIntegration({ outDir: "public/icons" });
```

Sprites are written to `<outDir>/<pack>.svg` at build time. Default is `public`.

### noto-emoji pack alias

`getIcon('noto-emoji', 'name')` automatically resolves to the `noto` pack slug. No special config needed.

## Common Mistakes

### CRITICAL No @iconify-json/\* packages installed

Wrong:

```sh
pnpm add @stephansama/astro-iconify-svgmap
# No icon pack installed
```

```astro
---
const href = await getIcon("mdi", "home");
// loadIcons finds no @iconify-json/mdi → sprite is empty
---
```

Correct:

```sh
pnpm add @iconify-json/mdi
```

The integration scans `node_modules/@iconify-json/*` to build sprite data. Without the corresponding pack installed, icons silently produce broken `<use>` references at build time.

Source: `core/astro-iconify-svgmap/src/utilities.ts`

### CRITICAL virtual:iconify-svgmap not imported in base layout

Wrong:

```astro
---
// BaseLayout.astro — virtual module never imported
import { getIcon } from "@stephansama/astro-iconify-svgmap/get";
const href = await getIcon("mdi", "home");
---
```

Correct:

```astro
---
import "virtual:iconify-svgmap";
---
```

The `virtual:iconify-svgmap` import is what causes Vite to resolve the virtual module and activate the plugin's `load()` hook, which loads all icon collections into memory. Without this import somewhere in the build graph, the plugin never initializes and `getIcon()` produces hrefs with no corresponding sprite data at build time.

Source: `core/astro-iconify-svgmap/src/index.ts`

### HIGH Using createPlugin instead of createIntegration in astro.config.mjs

Wrong:

```js
import createPlugin from "@stephansama/astro-iconify-svgmap";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    plugins: [createPlugin()], // bypasses astro:build:done hook
  },
});
```

Correct:

```js
import { createIntegration } from "@stephansama/astro-iconify-svgmap";

export default defineConfig({
  integrations: [createIntegration()],
});
```

`createPlugin` is the raw Vite plugin — it handles dev-time sprite serving but does not register the `astro:build:done` hook that writes the final sprite files to `outDir`. Using `createPlugin` directly means icons work in dev but sprites are missing in the production build. Always use `createIntegration` in Astro projects.

Source: `core/astro-iconify-svgmap/src/index.ts:createIntegration`

### HIGH iconifyRootDirectory not set in monorepo

Wrong:

```js
// apps/site/astro.config.mjs in a monorepo
// @iconify-json/mdi is in the workspace root node_modules, not apps/site/node_modules
createIntegration(); // looks in apps/site/node_modules — finds nothing
```

Correct:

```js
createIntegration({
  iconifyRootDirectory: new URL("../../", import.meta.url),
});
```

The default icon discovery path is relative to the Astro project root. In a pnpm monorepo, `@iconify-json/*` packages are typically hoisted to the workspace root. Pass `iconifyRootDirectory` as a `URL` pointing to the directory that contains the `node_modules/@iconify-json/` tree.

Source: `core/astro-iconify-svgmap/src/type.ts`
