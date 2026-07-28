import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: ["src/index.ts"],
	exports: true,
	format: "esm",
	publint: true,
	target: "esnext",
});
