import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	plugins: [
		// @ts-expect-error should work with tsup
		codecovRollupPlugin({
			bundleName: "remark-asciinema-bundle",
			enableBundleAnalysis: true,
			gitService: "github",
			telemetry: false,
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
	sourcemap: true,
	splitting: false,
	target: "esnext",
});
