import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";
import * as z from "zod";

export default defineConfig([
	{
		attw: false,
		dts: true,
		entry: "./src/index.ts",
		exports: true,
		format: ["esm", "cjs"],
		publint: false,
		skipNodeModulesBundle: true,
		target: "esnext",
	},
	{
		dts: true,
		entry: "./src/schema.ts",
		exports: {
			customExports(exports) {
				exports["./schema.json"] = "./config/schema.json";
				return exports;
			},
			enabled: true,
		},
		format: ["esm", "cjs"],
		hooks: {
			async "build:done"() {
				const { configSchema } = await import("./config/schema.mjs");
				const jsonSchema = z.toJSONSchema(configSchema);
				const jsonSchemaFile = JSON.stringify(jsonSchema);
				const jsonSchemaPath = path.join("./config", "schema.json");
				await fs.promises.writeFile(jsonSchemaPath, jsonSchemaFile);
			},
		},
		plugins: [ApiSnapshot()],
		outDir: "config",
	},
	//
]);
