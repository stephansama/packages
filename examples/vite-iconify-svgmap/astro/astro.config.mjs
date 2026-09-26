// @ts-check
import svelte from "@astrojs/svelte";
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/astro/integration";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [iconifySvgmap(), svelte()],
});
