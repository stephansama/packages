import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import * as z from "zod";

export default defineConfig([
	{
		attw: true,
		dts: true,
		format: ["esm", "cjs"],
		entry: "./src/index.ts",
		exports: true,
		hooks: {
			async "build:done"() {
				const schema = await import("./dist/index.mjs");
				const jsonSchema = z.toJSONSchema(schema.lhciSchema);
				const jsonString = JSON.stringify(jsonSchema);
				await fs.promises.writeFile(
					path.join("./dist", "schema.json"),
					jsonString,
				);
			},
		},
		publint: true,
		skipNodeModulesBundle: true,
		target: "esnext",
	},
]);
