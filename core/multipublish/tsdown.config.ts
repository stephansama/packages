import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";
import * as z from "zod";

export default defineConfig([
	{
		attw: { excludeEntrypoints: ["schema.json"], profile: "esm-only" },
		deps: { skipNodeModulesBundle: true },
		dts: false,
		entry: "./src/index.ts",
		format: "esm",
		plugins: [ApiSnapshot()],
		target: "esnext",
	},
	{
		deps: { skipNodeModulesBundle: true },
		dts: true,
		entry: "./src/schema.ts",
		exports: {
			customExports(exports) {
				exports["./schema.json"] = "./config/schema.json";
				return exports;
			},
			enabled: true,
		},
		format: "esm",
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
		outDir: "config",
		plugins: [ApiSnapshot()],
		target: "esnext",
	},
]);
