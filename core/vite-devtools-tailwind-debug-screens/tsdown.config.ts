import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: { index: "src/index.ts" },
	exports: true,
	format: ["esm"],
	publint: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
