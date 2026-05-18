import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "esm-only" },
	deps: { skipNodeModulesBundle: true },
	dts: true,
	entry: {
		cli: "./src/cli.ts",
		index: "./src/index.ts",
	},
	exports: { bin: true, enabled: true },
	format: "esm",
	plugins: [ApiSnapshot()],
	target: "esnext",
});
