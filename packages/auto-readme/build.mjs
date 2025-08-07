import * as fsp from "node:fs/promises";
import { build } from "tsup";
import yaml from "yaml";
import { z } from "zod";

import { configSchema } from "./src/config-schema.js";

await build({
	entry: ["src/*.ts"],
	external: ["yaml"],
	format: ["esm", "cjs"],
	skipNodeModulesBundle: true,
	sourcemap: true,
	splitting: false,
	target: "esnext",
});

const schema = z.toJSONSchema(configSchema);

const jsonSchema = JSON.stringify(schema);
const yamlSchema = yaml.stringify(schema);

await fsp.writeFile("./dist/schema.json", jsonSchema);
await fsp.writeFile("./dist/schema.yaml", yamlSchema);
