# @example/vite-devtools-tailwind-debug-screens

## 0.0.2

### Patch Changes

- 019ac09: add `configFile` option that loads breakpoints from an existing tailwind config or css theme file instead of duplicating the list in the vite config. `.css` files are scanned for `--breakpoint-*: <value>;` declarations (tailwind v4 `@theme`), layered over tailwind's default screens (`--breakpoint-*: initial` clears them, `--breakpoint-<name>: initial` removes one). `.js` / `.mjs` / `.cjs` / `.ts` files are dynamic-imported (tailwind v3, or v4 with the `@config` directive): `theme.screens` replaces the defaults and `theme.extend.screens` is added on top. Explicit `screens` still wins, and the plugin falls back to `DEFAULT_SCREENS` with a warning if the file can't be read.
