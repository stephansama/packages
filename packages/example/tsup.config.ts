import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	splitting: false,
	target: "esnext",
});
