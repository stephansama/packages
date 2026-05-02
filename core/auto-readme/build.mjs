import * as fsp from "node:fs/promises";
import path from "node:path";
import { build as tsdown } from "tsdown";
import * as z from "zod";

const outputDirectory = path.resolve("./dist");
const schemaDirectory = path.resolve("./config");

await build({ attw: false, entry: ["./src/index.ts"] });

await build({ dts: true, entry: ["./src/schema.ts"], outDir: schemaDirectory });

const { configSchema } = await import("./config/schema.mjs");

const jsonSchema = z.toJSONSchema(configSchema);

const jsonString = JSON.stringify(jsonSchema);

await fsp.writeFile(path.join(schemaDirectory, "schema.json"), jsonString);

/** @param {import("tsdown").InlineConfig} options */
function build(options) {
	return tsdown({
		attw: { excludeEntrypoints: ["schema.json"] },
		exports: true,
		format: ["esm", "cjs"],
		outDir: outputDirectory,
		skipNodeModulesBundle: true,
		target: "esnext",
		...options,
	});
}
