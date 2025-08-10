import { codecovVitePlugin } from "@codecov/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		codecovVitePlugin({
			bundleName: "packages-bundle",
			enableBundleAnalysis: true,
			gitService: "github",
			telemetry: false,
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
	test: {
		coverage: {
			include: ["core/*/src/**/*.{js,jsx,ts,tsx}"],
			provider: "v8",
			reporter: ["html", "json", "text"],
		},
	},
});
