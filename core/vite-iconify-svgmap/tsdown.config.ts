import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
	attw: {
		// astro components are typed by astro tooling, not typescript resolution
		excludeEntrypoints: ["./components"],
		profile: "esm-only",
	},
	dts: true,
	entry: ["src/index.ts", "src/astro.ts"],
	exports: {
		customExports(exports) {
			exports["./client"] = { types: "./client.d.ts" };
			exports["./components"] = "./components/index.ts";
			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
	},
	format: ["esm"],
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
	tsconfig: "tsconfig.json",
});
