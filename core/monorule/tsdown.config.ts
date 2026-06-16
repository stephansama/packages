import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";
import * as z from "zod";

const MJS_EXTENSION_REGEX = /\.mjs$/;

export default defineConfig({
	attw: { excludeEntrypoints: ["schema.json"], profile: "esm-only" },
	dts: true,
	entry: {
		cli: "./src/cli/index.ts",
		index: "./src/index.ts",
		schema: "./src/schema.ts",
	},
	exports: {
		bin: "./src/cli/index.ts",
		customExports(exports) {
			exports["./schema.json"] = "./dist/schema.json";

			for (const [key, value] of Object.entries(exports)) {
				if (typeof value !== "string" || !value.endsWith(".mjs")) continue;
				exports[key] = {
					import: value,
					types: value.replace(MJS_EXTENSION_REGEX, ".d.mts"),
				};
			}

			return Object.fromEntries(
				Object.entries(exports).toSorted(([a], [b]) => a.localeCompare(b)),
			);
		},
		enabled: true,
		legacy: true,
	},
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
