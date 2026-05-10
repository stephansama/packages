import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: true,
	dts: true,
	entry: ["src/index.ts"],
	exports: {
		enabled: true,
		legacy: true,
	},
	format: "esm",
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
