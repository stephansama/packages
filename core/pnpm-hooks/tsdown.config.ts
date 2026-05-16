import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

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
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
