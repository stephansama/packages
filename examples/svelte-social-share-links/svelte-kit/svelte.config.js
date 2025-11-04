import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	kit: {
		adapter: adapter({ assets: "dist", pages: "dist" }),
	},

	preprocess: vitePreprocess(),
};

export default config;
