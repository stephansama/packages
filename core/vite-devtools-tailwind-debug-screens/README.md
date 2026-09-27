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

| Option    | Default                          | Description                                                                       |
| --------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `screens` | tailwind's `sm`, `md`, ... `2xl` | Ordered breakpoint list. Each entry becomes a `(min-width: <value>)` media query. |

### Custom breakpoints

Pass whatever screens your tailwind config uses:

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
