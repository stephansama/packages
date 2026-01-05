import * as fsp from "node:fs/promises";
import * as path from "path";
import { build as tsdown } from "tsdown";
import * as z from "zod";

const outDir = path.resolve("./dist");
const schemaDir = path.resolve("./config");

await build({ attw: false, entry: ["./src/index.ts"] });

await build({ dts: true, entry: ["./src/schema.ts"], outDir: schemaDir });

const { configSchema } = await import("./config/schema.js");

const jsonSchema = z.toJSONSchema(configSchema);

const jsonString = JSON.stringify(jsonSchema);

await fsp.writeFile(path.join(schemaDir, "schema.json"), jsonString);

/** @param {import('tsdown').Options} opts */
function build(opts) {
	return tsdown({
		attw: { excludeEntrypoints: ["schema.json"] },
		format: ["esm", "cjs"],
		outDir,
		skipNodeModulesBundle: true,
		target: "esnext",
		...opts,
	});
}
