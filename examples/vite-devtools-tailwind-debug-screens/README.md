# vite-devtools-tailwind-debug-screens example

Plain [vite](https://vite.dev) app using
[`@stephansama/vite-devtools-tailwind-debug-screens`](../../core/vite-devtools-tailwind-debug-screens)
alongside [`@vitejs/devtools`](https://devtools.vite.dev/).

- `vite.config.js` enables Vite DevTools (`devtools: true`) and registers
  the plugin.
- `src/style.css` mirrors tailwind's default breakpoints so the layout
  changes as the viewport crosses each screen boundary.
- Run `pnpm dev` and open the embedded Vite DevTools dock — the **Tailwind
  Screens** panel shows the current viewport width, the active breakpoint,
  and every configured screen, all updated live as you resize the window.
  Nothing is rendered on the page itself.
- Run `pnpm build && pnpm preview` to confirm the plugin is completely
  absent from production output (it sets `apply: "serve"` internally).
