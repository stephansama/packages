import * as fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";
import * as z from "zod";

export default defineConfig({
	attw: { excludeEntrypoints: ["schema.json"], profile: "esm-only" },
	dts: true,
	entry: "./src/index.ts",
	exports: {
		customExports(exports) {
			exports["./schema.json"] = "./dist/schema.json";
			return exports;
		},
		enabled: true,
		legacy: true,
	},
	format: "esm",
	hooks: {
		async "build:done"() {
			const schema = await import("./dist/index.mjs");
			const jsonSchema = z.toJSONSchema(schema.lhciSchema);
			const jsonFile = JSON.stringify(jsonSchema);
			const jsonPath = path.join("./dist", "schema.json");
			await fs.promises.writeFile(jsonPath, jsonFile);
		},
	},
	plugins: [ApiSnapshot()],
	skipNodeModulesBundle: true,
	target: "esnext",
});
