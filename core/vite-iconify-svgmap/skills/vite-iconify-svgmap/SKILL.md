---
name: vite-iconify-svgmap
description: >
  Vite plugin (with an Astro integration) that builds SVG sprite maps from
  @iconify-json/* icon packs in memory. Import icons statically with
  `import href from "virtual:iconify-svgmap/<pack>/<icon>"`, or call
  `getIcon(pack, name)` from "virtual:iconify-svgmap" for icons only known while
  rendering. Add `@stephansama/vite-iconify-svgmap/client` to tsconfig types.
type: framework
requires:
  - vite
library: "@stephansama/vite-iconify-svgmap"
library_version: "0.0.0"
sources:
  - stephansama/packages:core/vite-iconify-svgmap/src/index.ts
  - stephansama/packages:core/vite-iconify-svgmap/src/astro/integration.ts
  - stephansama/packages:core/vite-iconify-svgmap/src/sveltekit.ts
  - stephansama/packages:core/vite-iconify-svgmap/frameworks/astro/icon.astro
  - stephansama/packages:core/vite-iconify-svgmap/frameworks/svelte/icon.svelte
  - stephansama/packages:core/vite-iconify-svgmap/src/state.ts
  - stephansama/packages:core/vite-iconify-svgmap/client.d.ts
---

# vite-iconify-svgmap

Generates SVG sprite maps from Iconify icon packs. Icon usage is tracked in memory; the only files written are the final sprites.

## Setup

1. Install the plugin and at least one `@iconify-json/*` pack:

```sh
pnpm add -D @stephansama/vite-iconify-svgmap @iconify-json/mdi
```

1. Astro: add the integration to `astro.config.mjs`:

```js
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/astro/integration";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [iconifySvgmap()],
});
```

SvelteKit: add the plugins from `@stephansama/vite-iconify-svgmap/sveltekit` after `sveltekit()` in `vite.config.js`:

```js
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({ plugins: [sveltekit(), iconifySvgmap()] });
```

Plain Vite: add `iconifySvgmap()` from `@stephansama/vite-iconify-svgmap` to `plugins`.

1. Add the virtual module types to `tsconfig.json`:

```json
{ "compilerOptions": { "types": ["@stephansama/vite-iconify-svgmap/client"] } }
```

## Core Patterns

### Static imports (preferred)

```astro
---
import home from "virtual:iconify-svgmap/mdi/home";
---

<svg width="24" height="24" aria-hidden="true"><use href={home}></use></svg>
```

The default export is the sprite href (`/_astro/mdi.<hash>.svg#home` in builds). Unknown packs or icons fail the build.

### Icons only known while rendering

```astro
---
import { getIcon } from "virtual:iconify-svgmap";

const href = getIcon(entry.data.pack, entry.data.icon);
---

<svg width="24" height="24" aria-hidden="true"><use href={href}></use></svg>
```

`getIcon` is synchronous. It registers the icon in memory and returns `/_iconify/<pack>.svg?v=<build>#<icon>`. The Astro integration writes those sprites in `astro:build:done`; without Astro call `writeSprites(clientOutDir)` after rendering.

### Icon components (astro, svelte)

```astro
---
import { Icon } from "@stephansama/vite-iconify-svgmap/astro";
---

<Icon pack="mdi" name="home" size={24} title="Home" class="nav-icon" />
```

`@stephansama/vite-iconify-svgmap/astro` and `@stephansama/vite-iconify-svgmap/svelte` (Svelte 5) both export `Icon`. It calls `getIcon` and renders `<svg><use href /></svg>`. Props: `pack`, `name`, `size` (default `"1em"`), `title` (adds `role="img"`, otherwise `aria-hidden="true"`); other attributes pass through to `<svg>`. Same rules as `getIcon`: needs the Astro integration (or `writeSprites`) and server rendering during the build; client-only Svelte components are not registered.

## Common Mistakes

### HIGH Computed virtual imports

Wrong:

```js
const href = await import(`virtual:iconify-svgmap/${pack}/${name}`);
```

Correct:

```js
import { getIcon } from "virtual:iconify-svgmap";
const href = getIcon(pack, name);
```

Vite cannot resolve template-literal virtual imports. Use `getIcon` for dynamic names.

### HIGH Using the raw plugin with getIcon in SvelteKit

Wrong:

```js
export default defineConfig({ plugins: [sveltekit(), iconifySvgmap()] }); // from "@stephansama/vite-iconify-svgmap"
```

Correct:

```js
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/sveltekit";
export default defineConfig({ plugins: [sveltekit(), iconifySvgmap()] });
```

Without the `/sveltekit` plugins the prerender crawler fails with `404 /_iconify/<pack>.svg` and sprites are never written.

### HIGH Using the raw plugin with getIcon in Astro

Wrong:

```js
export default defineConfig({ vite: { plugins: [iconifySvgmap()] } });
```

Correct:

```js
export default defineConfig({ integrations: [iconifySvgmap()] });
```

Astro prerenders after Vite's build hooks, so only the integration (`/astro/integration`) can write `getIcon` sprites. Static imports work either way.

### MEDIUM getIcon at request time

Icons first requested by on-demand rendered routes, only by client-side code, or by prerendering in another runtime (e.g. workerd) are not included in written sprites. Worker threads of the build process (SvelteKit's prerenderer) are supported. Use static imports, or make sure those icons are also rendered during the build.

Source: `core/vite-iconify-svgmap/src/index.ts`
