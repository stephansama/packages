import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: { profile: "node16" },
	dts: true,
	entry: ["src/cli.ts", "src/index.ts", "src/get.ts"],
	exports: true,
	external: ["virtual:iconify-svgmap"],
	format: ["esm", "cjs"],
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
