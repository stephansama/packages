import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "dist/index.js"),
			fileName: "components",
			formats: ["iife"],
			name: "Components",
		},
		outDir: "dist-js",
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: [svelte() as any],
});
