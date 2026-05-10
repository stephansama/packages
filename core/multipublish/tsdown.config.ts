import * as fs from "node:fs";
import ApiSnapshot from "tsnapi/rolldown";
import path from "node:path";
import { defineConfig } from "tsdown";
import * as z from "zod";

export default defineConfig([
	{
		attw: true,
		dts: false,
		entry: "./src/index.ts",
		plugins: [ApiSnapshot()],
		format: ["esm", "cjs"],
		skipNodeModulesBundle: true,
		target: "esnext",
	},
	{
		attw: true,
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
