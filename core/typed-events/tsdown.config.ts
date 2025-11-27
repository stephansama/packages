import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "node16" },
	dts: true,
	entry: ["src/index.ts"],
	exports: true,
	format: ["esm", "cjs"],
	publint: true,
	target: "esnext",
});
