import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["src/*.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	target: "esnext",
});
