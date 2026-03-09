import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["./src/index.ts", "./src/cli.ts"],
	exports: true,
	format: ["esm", "cjs"],
	publint: true,
	target: "esnext",
});
