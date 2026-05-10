import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
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
