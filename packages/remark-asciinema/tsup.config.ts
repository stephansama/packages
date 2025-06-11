import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts"],
	sourcemap: true,
	splitting: false,
	target: "esnext",
	format: ["esm", "cjs"],
});
