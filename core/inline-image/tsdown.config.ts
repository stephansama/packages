import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: {
		cli: "./src/cli.ts",
		index: "./src/index.ts",
	},
	exports: {
		bin: "./src/cli.ts",
		customExports(exports) {
			exports["./astro"] = "./src/astro/index.ts";
			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
		legacy: true,
	},
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
