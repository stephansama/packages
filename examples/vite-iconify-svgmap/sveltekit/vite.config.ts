import iconifySvgmap from "@stephansama/vite-iconify-svgmap/svelte/integration";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit(), iconifySvgmap()],
});
