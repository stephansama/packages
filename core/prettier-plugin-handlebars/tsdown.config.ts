import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["src/plugin.ts"],
	exports: true,
	format: ["esm", "cjs"],
	publint: true,
	target: "esnext",
});
