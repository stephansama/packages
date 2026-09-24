// @ts-check
import iconifySvgmap from "@stephansama/vite-iconify-svgmap/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [iconifySvgmap()],
});
