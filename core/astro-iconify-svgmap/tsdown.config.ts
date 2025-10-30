import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "node16" },
	dts: true,
	entry: ["src/cli.ts", "src/index.ts", "src/get.ts"],
	external: ["virtual:iconify-svgmap"],
	format: ["esm", "cjs"],
	sourcemap: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
