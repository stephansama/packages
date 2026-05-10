import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig([
	{
		attw: true,
		dts: true,
		entry: ["src/index.ts"],
		exports: true,
		format: ["esm", "cjs"],
		plugins: [ApiSnapshot()],
		publint: true,
		target: "esnext",
	},
	{
		attw: {
			profile: "node16",
		},
		entry: {
			cli: "./src/cli/index.ts",
		},
		exports: {
			bin: true,
			enabled: true,
		},
		format: ["esm", "cjs"],
		target: "esnext",
	},
]);
