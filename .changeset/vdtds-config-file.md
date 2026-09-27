---
"@stephansama/vite-devtools-tailwind-debug-screens": minor
---

add `configFile` option that loads breakpoints from an existing tailwind config or css theme file instead of duplicating the list in the vite config. `.css` files are scanned for `--breakpoint-*: <value>;` declarations (tailwind v4 `@theme`); `.js` / `.mjs` / `.cjs` / `.ts` files are dynamic-imported and their `theme.screens` (merged with `theme.extend.screens`) is used (tailwind v3, or v4 with the `@config` directive). Explicit `screens` still wins, and the plugin falls back to `DEFAULT_SCREENS` with a warning if the file can't be read.
