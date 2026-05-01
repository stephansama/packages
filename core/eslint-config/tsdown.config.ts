import { defineConfig } from "tsdown";

export default defineConfig([
	{
		attw: true,
		dts: true,
		entry: ["src/index.ts"],
		exports: true,
		format: ["esm", "cjs"],
		publint: true,
		target: "esnext",
	},
	{
		dts: false,
		entry: {
			cli: "./src/cli/index.ts",
		},
		format: ["esm", "cjs"],
		target: "esnext",
	},
]);
