import * as fsp from "node:fs/promises";
import * as path from "path";
import { build as tsdown } from "tsdown";
import yaml from "yaml";
import { z } from "zod";

const outDir = path.resolve("./dist");
const schemaDir = path.resolve("./config");

await build({ entry: ["./src/index.ts"] });

await build({ dts: true, entry: ["./src/schema.ts"], outDir: schemaDir });

const { configSchema } = await import("./config/schema.js");

const schema = z.toJSONSchema(configSchema);

const jsonSchema = JSON.stringify(schema);
const yamlSchema = yaml.stringify(schema);

await fsp.writeFile(path.join(schemaDir, "schema.json"), jsonSchema);
await fsp.writeFile(path.join(schemaDir, "schema.yaml"), yamlSchema);

/** @param {import('tsdown').Options} opts */
function build(opts) {
	return tsdown({
		attw: { excludeEntrypoints: ["schema.json", "schema.yaml"] },
		format: ["esm", "cjs"],
		outDir,
		skipNodeModulesBundle: true,
		splitting: false,
		target: "esnext",
		...opts,
	});
}
