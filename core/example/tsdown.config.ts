import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: {
		cli: "./src/cli.ts",
		index: "./src/index.ts",
	},
	exports: {
		bin: true,
		enabled: true,
	},
	format: "esm",
	publint: true,
	target: "esnext",
});
