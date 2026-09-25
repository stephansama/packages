<div align="center">

# [`@stephansama`](https://github.com/stephansama) / vite-iconify-svgmap

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/vite-iconify-svgmap)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/vite-iconify-svgmap)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fvite-iconify-svgmap?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/vite-iconify-svgmap)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/vite-iconify-svgmap)](https://socket.dev/npm/package/@stephansama/vite-iconify-svgmap/overview)
[![jsr](https://jsr.io/badges/@stephansama/vite-iconify-svgmap)](https://jsr.io/@stephansama/vite-iconify-svgmap)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/vite-iconify-svgmap?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/vite-iconify-svgmap)

[![@iconify/types](https://img.shields.io/badge/@iconify/types-2.0.0-026C9C.svg?logo=iconify&logoColor=ffffff&labelColor=026C9C)](https://npmx.dev/package/@iconify/types)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![astro](https://img.shields.io/badge/astro-6.3.1-BC52EE.svg?logo=astro&logoColor=ffffff&labelColor=BC52EE)](https://npmx.dev/package/astro)
[![svelte](https://img.shields.io/badge/svelte-5.51.2-FF3E00.svg?logo=svelte&logoColor=ffffff&labelColor=FF3E00)](https://npmx.dev/package/svelte)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)
[![vite](https://img.shields.io/badge/vite-6.3.5-9135FF.svg?logo=vite&logoColor=ffffff&labelColor=9135FF)](https://npmx.dev/package/vite)

<!-- BADGE end -->

Vite plugin for generating iconify svg sprite maps in memory

</div>

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [Astro](#astro)
  - [SvelteKit](#sveltekit)
  - [Vite](#vite)
  - [Static imports](#static-imports)
  - [Icons known while rendering](#icons-known-while-rendering)
  - [Icon components](#icon-components)
- [Options](#options)
- [How it works](#how-it-works)

</details>

## Installation

Install the plugin and at least one `@iconify-json/*` icon pack

```sh
pnpm install -D @stephansama/vite-iconify-svgmap @iconify-json/logos
```

Add the virtual module types to your `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@stephansama/vite-iconify-svgmap/client"]
  }
}
```

## Usage

### Astro

The astro integration adds the vite plugin and writes sprites for icons
registered with `getIcon` once every page has rendered.

```js
// astro.config.mjs
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/astro/integration";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [iconifySvgmap()],
});
```

### SvelteKit

Add the sveltekit plugins **after** `sveltekit()`:

```js
// vite.config.js
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), iconifySvgmap()],
});
```

SvelteKit prerenders in a worker thread and has no hook after prerendering,
so this plugin:

- receives `getIcon` calls made inside the prerender worker over an in
  memory `BroadcastChannel`
- writes empty placeholder sprites for every installed icon pack when the
  client build finishes, so the prerender crawler does not fail on
  `<use href>` links to sprites that do not exist yet
- writes the real sprites (and removes unused placeholders) after
  prerendering, before the adapter copies the client output

### Vite

```js
// vite.config.js
import iconifySvgmap from "@stephansama/vite-iconify-svgmap";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [iconifySvgmap()],
});
```

Static imports need nothing else. If you use `getIcon` in a server rendered
or prerendered app, call `writeSprites` with your client output directory
once rendering has finished:

```js
import { writeSprites } from "@stephansama/vite-iconify-svgmap";

await writeSprites("dist");
```

### Static imports

Import an icon as `virtual:iconify-svgmap/<pack>/<icon>` to get its sprite
href. Unknown packs or icons fail the build.

```astro
---
import astro from "virtual:iconify-svgmap/logos/astro";
---

<svg width="24" height="24"><use href={astro}></use></svg>
```

Only the imported icons end up in a content hashed sprite per pack (for
example `/_astro/logos.BzUCTX55.svg`).

### Icons known while rendering

When the icon name is only known while rendering (cms data, frontmatter,
loops), use `getIcon`:

```astro
---
import { getIcon } from "virtual:iconify-svgmap";

const href = getIcon(entry.data.iconPack, entry.data.icon);
---

<svg width="24" height="24"><use href={href}></use></svg>
```

`getIcon` records the icon in memory and returns
`/_iconify/<pack>.svg?v=<build>#<icon>`. The sprite is written after all pages
have rendered.

> \[!NOTE]
> `getIcon` icons must be rendered during the build, in the same process or
> one of its worker threads (static astro sites and prerendered sveltekit
> pages). Icons first requested at runtime by an on demand rendered route, or
> only by client side code, are not included in the written sprites. During
> development every icon works, including client rendered ones.

### Icon components

Each framework subpath exports an `Icon` component that wraps `getIcon` in an
`<svg><use /></svg>`. They follow the same rules as `getIcon`: icons must be
rendered on the server during the build (for example astro pages or
server rendered svelte islands) and the sprites written afterwards (the astro
integration does this).

| Framework | Import                                                            |
| --------- | ----------------------------------------------------------------- |
| astro     | `import { Icon } from "@stephansama/vite-iconify-svgmap/astro";`  |
| svelte 5  | `import { Icon } from "@stephansama/vite-iconify-svgmap/svelte";` |

```astro
---
import { Icon } from "@stephansama/vite-iconify-svgmap/astro";
---

<Icon pack="logos" name="github-icon" size={24} title="GitHub" />
<Icon pack="heroicons" name="heart-solid" class="text-red-500" />
```

```svelte
<script>
  import { Icon } from "@stephansama/vite-iconify-svgmap/svelte";
</script>

<Icon pack="logos" name="svelte-icon" size={24} title="Svelte" />
```

| Prop    | Default | Description                                                          |
| ------- | ------- | -------------------------------------------------------------------- |
| `pack`  |         | iconify pack, e.g. `logos` for `@iconify-json/logos`                 |
| `name`  |         | icon name inside the pack                                            |
| `size`  | `"1em"` | width and height                                                     |
| `title` |         | accessible label; without it the icon gets `aria-hidden="true"`      |
| ...     |         | any other svg attribute (`class`, `style`, ...) is passed to `<svg>` |

Icons that use `currentColor` follow the css `color` of the component.

## Options

| Option | Default       | Description                                                                            |
| ------ | ------------- | -------------------------------------------------------------------------------------- |
| `dir`  | `"_iconify"`  | folder, relative to the output directory, for sprites of icons registered by `getIcon` |
| `root` | vite's `root` | directory used to resolve `@iconify-json/*` packages                                   |

## How it works

Nothing is written to the file system until the final output:

- icon packs are loaded lazily, only when an icon from the pack is requested
- during development sprites are generated in memory and served by the dev
  server
- static imports are emitted as vite assets, so they are hashed and moved to
  the output like any other asset
- `getIcon` usage is kept in an in memory registry and flushed once by
  `writeSprites`
