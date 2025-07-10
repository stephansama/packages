import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/cli.ts", "src/index.ts", "src/get.ts"],
	external: ["virtual:iconify-svgmap"],
	format: ["esm", "cjs"],
	plugins: [
		// @ts-expect-error should work with tsup
		codecovRollupPlugin({
			bundleName: "astro-iconify-svg-bundle",
			enableBundleAnalysis: true,
			gitService: "github",
			telemetry: false,
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
	sourcemap: true,
	splitting: false,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
