import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/*.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	splitting: false,
	target: "esnext",
});
