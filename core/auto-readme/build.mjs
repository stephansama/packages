import deepmerge from "deepmerge";
import * as fsp from "node:fs/promises";
import * as path from "path";
import { build as tsup } from "tsup";
import yaml from "yaml";
import { z } from "zod";

import { configSchema } from "./src/schema.js";

const outDir = path.resolve("./dist");
const schemaDir = path.resolve("./config");

await build({ entry: ["./src/index.ts"] });

await build({ dts: true, entry: ["./src/schema.js"], outDir: schemaDir });

const schema = deepmerge(z.toJSONSchema(configSchema), {
	$schema: {
		default: `https://unpkg.com/@stephansama/auto-readme@0.1.0/config/schema.json`,
		type: "string",
	},
});

const jsonSchema = JSON.stringify(schema);
const yamlSchema = yaml.stringify(schema);

await fsp.writeFile(path.join(schemaDir, "schema.json"), jsonSchema);
await fsp.writeFile(path.join(schemaDir, "schema.yaml"), yamlSchema);

/** @param {import('tsup').Options} opts */
function build(opts) {
	return tsup({
		format: ["esm", "cjs"],
		outDir,
		skipNodeModulesBundle: true,
		sourcemap: true,
		splitting: false,
		target: "esnext",
		...opts,
	});
}
