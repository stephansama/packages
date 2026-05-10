import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: [tsconfigPaths() as any],
	test: {
		environment: "jsdom",
		setupFiles: "./src/tests/setup.ts",
	},
});
