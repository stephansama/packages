---
"@stephansama/vite-devtools-tailwind-debug-screens": minor
---

Add Astro integration entry at `/astro/integration`. Wraps the vite plugin AND uses `injectScript("page", …)` so the viewport-reporter reaches `.astro`-rendered pages that Vite's `transformIndexHtml` doesn't cover.
