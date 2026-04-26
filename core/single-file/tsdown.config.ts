import { defineConfig } from "tsdown";

export default defineConfig([
	{
		attw: true,
		dts: true,
		entry: "src/index.ts",
		exports: true,
		format: ["esm", "cjs"],
		publint: true,
		target: "esnext",
	},
	{
		entry: "src/cli.ts",
		format: ["esm", "cjs"],
		target: "esnext",
	},
]);
