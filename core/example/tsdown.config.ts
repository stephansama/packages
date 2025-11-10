import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["./src/index.ts"],
	exports: true,
	format: "cjs",
	publint: true,
	target: "esnext",
});
