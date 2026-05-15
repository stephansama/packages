import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { profile: "esm-only" },
	dts: true,
	entry: ["src/index.ts", "src/types.ts"],
	exports: {
		customExports(exports) {
			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
	},
	publint: true,
	target: "esnext",
});
