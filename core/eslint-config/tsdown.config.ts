import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: {
		cli: "./src/cli/index.ts",
		index: "./src/index.ts",
	},
	exports: {
		bin: "./src/cli/index.ts",
		enabled: true,
		legacy: true,
	},
	format: ["esm"],
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
