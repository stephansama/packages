import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: ["./src/**/*.ts", "!./src/**/*.test.ts", "!./src/**/*.fixture.ts"],
	exports: {
		bin: "./src/cli.ts",
		customExports(exports) {
			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
	},
	format: "esm",
	publint: true,
	target: "esnext",
});
