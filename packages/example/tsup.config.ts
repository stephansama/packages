import { codecovVitePlugin } from "@codecov/vite-plugin";
import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/*.ts"],
	format: ["esm", "cjs"],
	plugins: [
		// @ts-expect-error should work with tsup
		codecovVitePlugin({
			bundleName: "packages-bundle",
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
