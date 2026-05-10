import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";
import * as z from "zod";

export default defineConfig({
	attw: { excludeEntrypoints: ["schema.json"], profile: "esm-only" },
	deps: { skipNodeModulesBundle: true },
	dts: true,
	entry: {
		cli: "./src/cli.ts",
		index: "./src/index.ts",
		schema: "./src/schema.ts",
	},
	exports: {
		bin: true,
		customExports(exports) {
			exports["./schema.json"] = "./config/schema.json";

			return Object.fromEntries(
				Object.entries(exports).toSorted(([keyA], [keyB]) =>
					keyA.localeCompare(keyB),
				),
			);
		},
		enabled: true,
	},
	format: "esm",
	hooks: {
		async "build:done"() {
			const { configSchema } = await import("./config/schema.mjs");
			const jsonSchema = z.toJSONSchema(configSchema);
			const jsonString = JSON.stringify(jsonSchema);
			const jsonPath = path.join("./config/", "schema.json");
			await fs.promises.writeFile(jsonPath, jsonString);
		},
	},
	plugins: [ApiSnapshot()],
	target: "esnext",
});
