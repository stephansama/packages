import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: {
		"astro/integration": "src/astro.ts",
		"index": "src/index.ts",
	},
	exports: true,
	format: ["esm"],
	publint: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
