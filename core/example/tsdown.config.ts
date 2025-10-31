import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["./src/cli.ts"],
	format: "cjs",
	sourcemap: true,
	target: "esnext",
	exports: true,
});
