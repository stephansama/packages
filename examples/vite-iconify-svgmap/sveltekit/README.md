# vite-iconify-svgmap sveltekit example

Prerendered [SvelteKit](https://svelte.dev/docs/kit) site using [`@stephansama/vite-iconify-svgmap`](../../../core/vite-iconify-svgmap) with static icon imports, `getIcon` and the svelte `Icon` component

`vite.config.ts` adds the sveltekit plugin from `@stephansama/vite-iconify-svgmap/svelte/integration` after `sveltekit()` so sprites for icons rendered with `getIcon` are written after prerendering
