import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "dist/index.js"),
			fileName: "components",
			formats: ["iife"],
			name: "Components",
		},
		outDir: "dist-js",
	},
	plugins: [svelte()],
});
