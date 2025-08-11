import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			include: ["core/*/src/**/*.{js,jsx,ts,tsx}"],
			provider: "v8",
			reporter: ["html", "json", "text"],
		},
		outputFile: { junit: "./coverage/test-report.junit.xml" },
		reporters: ["default", "junit"],
	},
});
