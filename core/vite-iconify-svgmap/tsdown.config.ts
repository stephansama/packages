import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: {
		// framework components ship as source and are typed by framework tooling
		excludeEntrypoints: ["./astro", "./svelte"],
		profile: "esm-only",
	},
	dts: true,
	entry: {
		"astro/integration": "src/astro/integration.ts",
		"index": "src/index.ts",
	},
	exports: {
		customExports(exports) {
			exports["./astro"] = "./frameworks/astro/index.ts";
			exports["./client"] = { types: "./client.d.ts" };
			exports["./svelte"] = {
				default: "./frameworks/svelte/index.js",

				svelte: "./frameworks/svelte/index.js",
				types: "./frameworks/svelte/index.d.ts",
			};
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
