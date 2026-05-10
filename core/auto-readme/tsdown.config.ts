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
		bin: "./src/cli.ts",
		customExports(exports) {
			exports["./schema.json"] = "./dist/schema.json";

			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
		legacy: true,
	},
	format: "esm",
	hooks: {
		async "build:done"() {
			const { configSchema } = await import("./dist/schema.mjs");
			const jsonSchema = z.toJSONSchema(configSchema);
			const jsonSchemaFile = JSON.stringify(jsonSchema);
			const jsonSchemaPath = path.join("./dist", "schema.json");
			await fs.promises.writeFile(jsonSchemaPath, jsonSchemaFile);
		},
	},
	plugins: [ApiSnapshot()],
	target: "esnext",
});
