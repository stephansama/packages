import * as fsp from "node:fs/promises";
import { build } from "tsup";
import yaml from "yaml";
import { z } from "zod";

import { configSchema } from "./src/schema.js";

/** @type {import('tsup').Options} */
const commonOpts = {
	format: ["esm", "cjs"],
	skipNodeModulesBundle: true,
	sourcemap: true,
	splitting: false,
	target: "esnext",
};

await build({
	...commonOpts,
	entry: ["src/*.ts"],
	external: ["yaml"],
});

await build({
	...commonOpts,
	dts: true,
	entry: ["src/*.js"],
	outDir: "./config/",
});

const schema = z.toJSONSchema(configSchema);

const jsonSchema = JSON.stringify(schema);
const yamlSchema = yaml.stringify(schema);

await fsp.writeFile("./config/schema.json", jsonSchema);
await fsp.writeFile("./config/schema.yaml", yamlSchema);
