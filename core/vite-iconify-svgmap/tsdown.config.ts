import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: {
		// framework components ship as source and are typed by framework tooling
		excludeEntrypoints: [
			"./astro",
			"./astro/component",
			"./svelte",
			"./svelte/component",
		],
		profile: "esm-only",
	},
	dts: true,
	entry: {
		"astro/integration": "src/astro.ts",
		"index": "src/index.ts",
		"svelte/integration": "src/svelte.ts",
	},
	exports: {
		customExports(exports) {
			exports["./astro"] = "./frameworks/astro/index.ts";
			exports["./astro/component"] = "./frameworks/astro/component.ts";
			exports["./client"] = { types: "./client.d.ts" };
			// condition order matters: `default` must come last
			/* eslint-disable perfectionist/sort-objects */
			exports["./svelte"] = {
				types: "./frameworks/svelte/index.d.ts",
				svelte: "./frameworks/svelte/index.js",
				default: "./frameworks/svelte/index.js",
			};
			exports["./svelte/component"] = {
				types: "./frameworks/svelte/component.d.ts",
				svelte: "./frameworks/svelte/component.js",
				default: "./frameworks/svelte/component.js",
			};
			/* eslint-enable perfectionist/sort-objects */
			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
	},
	format: ["esm"],
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
