// @ts-check
import { createIntegration } from "@stephansama/astro-iconify-svgmap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		createIntegration({
			iconifyRootDirectory: new URL(".", import.meta.url),
			outDir: "dist",
		}),
	],
});
