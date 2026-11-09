import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: { index: "./src/index.ts" },
	exports: true,
	publint: true,
	target: "esnext",
});
