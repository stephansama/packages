<div align="center">

# [`@stephansama`](https://github.com/stephansama) / vite-devtools-tailwind-debug-screens

Vite DevTools integration that surfaces the active tailwind breakpoint
inside the [`@vitejs/devtools`](https://devtools.vite.dev/) dock. No
floating badge, no overlay.

</div>

## Installation

```sh
pnpm install -D @stephansama/vite-devtools-tailwind-debug-screens \
  @vitejs/devtools
```

## Usage

```js
// vite.config.js
import tailwindDebugScreens from "@stephansama/vite-devtools-tailwind-debug-screens";
import { defineConfig } from "vite";

export default defineConfig({
  devtools: true,
  plugins: [tailwindDebugScreens()],
});
```

Run `vite` and open the embedded Vite DevTools dock — the **Tailwind
Screens** panel shows:

- the current viewport width in pixels
- the active breakpoint name (`<sm`, `sm`, `md`, `lg`, `xl`, `2xl`, ...)
- every configured screen with its `min-width`

The values update live as you resize the window. Nothing is rendered on the
page itself.

## How it works

- During dev, the plugin injects a small inline module script into the
  page's html that POSTs `window.innerWidth` to a dev-server middleware
  (`/__vdtds/width`) on load and on resize. Nothing is rendered on the page.
- The plugin's `devtools.setup` hook creates a
  [`ctx.createJsonRenderer`](https://devtools.vite.dev/kit/devtools-plugin)
  spec and registers a `json-render` dock — no client bundle needs to be
  shipped for the panel UI.
- Every viewport update recomputes the active breakpoint on the server and
  calls `ui.updateSpec(...)`; Vite DevTools re-renders the dock and swaps
  the rail icon to a small SVG of the active label.
- The plugin sets `apply: "serve"`, so it is completely inert in production
  builds.

## Options

| Option       | Default                          | Description                                                                                     |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `configFile` | -                                | Path to a tailwind config or css theme file to read breakpoints from. Ignored if `screens` set. |
| `screens`    | tailwind's `sm`, `md`, ... `2xl` | Ordered breakpoint list. Each entry becomes a `(min-width: <value>)` media query.               |

### Reading breakpoints from your tailwind config

Point `configFile` at whatever file already declares your screens - the
plugin loads it at `configResolved` time and skips shipping a duplicate
list in your vite config.

**Tailwind v4** (css-first, `@theme` block):

```js
tailwindDebugScreens({ configFile: "src/app.css" });
```

```css
/* src/app.css */
@theme {
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
}
```

**Tailwind v3 or v4 `@config`** (js/ts config):

```js
tailwindDebugScreens({ configFile: "tailwind.config.ts" });
```

```ts
// tailwind.config.ts
export default {
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px" },
    extend: { screens: { "3xl": "1920px" } },
  },
};
```

`configFile` is resolved against vite's `root`. Loaded screens are
layered over tailwind's defaults so single-breakpoint configs don't drop
the built-ins.

- **`.css`** files are scanned for any `--breakpoint-*: <value>;`
  declaration (so `@theme`, `:root`, `@layer base` etc. all work). Each
  declaration adds to, or overrides, the default of the same name.
  `--breakpoint-<name>: initial;` removes that default.
- **`.js` / `.mjs` / `.cjs` / `.ts`** files are dynamic-imported and
  follow tailwind v3 semantics: `theme.screens` replaces the defaults,
  `theme.extend.screens` adds to whichever base is in effect. The js
  path is cache-busted by the file's mtime, so edits are picked up on
  a dev-server restart in the same process.

Screens with non-string values (tailwind's `{ min, max }` shape) are
ignored. If loading fails, or the file resolves to no breakpoints at all
(e.g. `theme: { screens: {} }`), a warning is logged and the plugin falls
back to `DEFAULT_SCREENS`.

### Passing screens directly

If you'd rather keep the list next to your plugin config:

```js
tailwindDebugScreens({
  screens: [
    { name: "mobile", value: "480px" },
    { name: "tablet", value: "768px" },
    { name: "desktop", value: "1024px" },
    { name: "wide", value: "1440px" },
  ],
});
```

Below the smallest breakpoint the dock renders `<sm` (e.g. `<mobile`) so
you can tell the viewport is narrower than any configured screen. `px` and
`rem` values are supported.

## Requirements

- `vite` >= 8.3 (required by `@vitejs/devtools`)
- `@vitejs/devtools` enabled via `devtools: true` in the vite config
- `@vitejs/devtools-kit` is an optional peer dependency; if missing the
  plugin silently skips dock registration
