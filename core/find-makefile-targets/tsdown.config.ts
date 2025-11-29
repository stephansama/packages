import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	entry: ["src/index.ts"],
	exports: true,
	format: ["esm", "cjs"],
	publint: true,
	target: "esnext",
});
