import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["./src/cli.ts"],
	exports: true,
	format: "cjs",
	target: "esnext",
});
