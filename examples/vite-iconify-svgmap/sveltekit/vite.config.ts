import iconifySvgmap from "@stephansama/vite-iconify-svgmap/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit(), iconifySvgmap()],
});
