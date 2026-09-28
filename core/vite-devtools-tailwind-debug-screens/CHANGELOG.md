# @stephansama/vite-devtools-tailwind-debug-screens

## 0.3.0

### Minor Changes

- 48eacfd: Add Astro integration entry at `/astro/integration`. Wraps the vite plugin AND uses `injectScript("page", …)` so the viewport-reporter reaches `.astro`-rendered pages that Vite's `transformIndexHtml` doesn't cover.

## 0.2.0

### Minor Changes

- 8a003a0: created vite devtools integration that surfaces the active tailwind breakpoint inside the `@vitejs/devtools` dock, replacing the floating badge from `tailwindcss-debug-screens` with a `json-render` panel and a live dock-rail icon that tracks the current viewport
