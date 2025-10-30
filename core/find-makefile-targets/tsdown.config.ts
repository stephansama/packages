import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	splitting: false,
	target: "esnext",
});
