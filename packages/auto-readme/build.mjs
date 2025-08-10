import * as fsp from "node:fs/promises";
import * as path from "path";
import { build } from "tsup";
import yaml from "yaml";
import { z } from "zod";

import { configSchema } from "./src/schema.js";

const outDir = path.resolve("./dist");
const schemaDir = path.resolve("./config");

/** @type {import('tsup').Options} */
const commonOpts = {
	format: ["esm", "cjs"],
	outDir,
	skipNodeModulesBundle: true,
	sourcemap: true,
	splitting: false,
	target: "esnext",
};

await build({
	...commonOpts,
	entry: ["src/index.ts"],
	external: ["yaml"],
});

await build({
	...commonOpts,
	dts: true,
	entry: ["src/*.js"],
	outDir: schemaDir,
});

const schema = z.toJSONSchema(configSchema);

const jsonSchema = JSON.stringify(schema);
const yamlSchema = yaml.stringify(schema);

await fsp.writeFile(path.join(schemaDir, "schema.json"), jsonSchema);
await fsp.writeFile(path.join(schemaDir, "schema.yaml"), yamlSchema);
