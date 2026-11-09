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
		async "build:before"() {
			const { configSchema } = await import("./src/schema.ts");
			const jsonSchema = z.toJSONSchema(configSchema);
			const jsonSchemaFile = JSON.stringify(jsonSchema);
			const jsonSchemaPath = path.join("./dist", "schema.json");
			await fs.promises.mkdir(path.dirname(jsonSchemaPath), {
				recursive: true,
			});
			await fs.promises.writeFile(jsonSchemaPath, jsonSchemaFile);
		},
	},
	plugins: [ApiSnapshot()],
	publint: true,
	target: "esnext",
});
