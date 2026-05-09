import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import * as z from "zod";

export default defineConfig([
	{
		attw: false,
		dts: true,
		entry: "./src/index.ts",
		publint: false,
		format: ['esm', 'cjs'],
		exports: true,
		skipNodeModulesBundle: true,
		target: "esnext",
	},
	{
		exports: true,
		dts: true,
		entry: "./src/schema.ts",
		format: ['esm', 'cjs'],
		hooks: {
			async "build:done"() {
				const { configSchema } = await import("./config/schema.mjs");
				const jsonSchema = z.toJSONSchema(configSchema);
				const jsonSchemaFile = JSON.stringify(jsonSchema);
				const jsonSchemaPath = path.join("./config", "schema.json");
				await fs.promises.writeFile(jsonSchemaPath, jsonSchemaFile);
			},
		},
		outDir: "config",
	},
	//
]);
