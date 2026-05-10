import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import * as z from "zod";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig([
	{
		// attw: { 'profile': 'esm-only' },
		dts: false,
		entry: "./src/index.ts",
		format: ["esm",],
		plugins: [ApiSnapshot()],
		skipNodeModulesBundle: true,
		target: "esnext",
	},
	{
		// attw: { 'profile': 'esm-only' },
		dts: true,
		entry: "./src/schema.ts",
		exports: {
			customExports(exports) {
				exports["./schema.json"] = "./config/schema.json";
				return exports;
			},
			enabled: true,
		},
		format: ["esm",],
		hooks: {
			async "build:done"() {
				const { configSchema } = await import("./config/schema.mjs");

				const jsonSchema = z.toJSONSchema(configSchema);

				const jsonString = JSON.stringify(jsonSchema);

				await fs.promises.writeFile(
					path.join("./config/", "schema.json"),
					jsonString,
				);
			},
		},
		plugins: [ApiSnapshot()],
		outDir: "config",
		skipNodeModulesBundle: true,
		target: "esnext",
	},
]);
