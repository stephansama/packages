import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/cli.ts", "src/index.ts", "src/get.ts"],
	external: ["virtual:iconify-svgmap"],
	format: ["esm", "cjs"],
	sourcemap: true,
	splitting: false,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
