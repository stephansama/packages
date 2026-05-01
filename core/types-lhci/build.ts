import * as fsp from "node:fs/promises";
import path from "node:path";
import { type Options, build as tsdown } from "tsdown";
import * as z from "zod";

const outDirectory = path.resolve("./dist");

await build({
	dts: true,
	entry: ["./src/index.ts"],
});

const schemas = await import("./dist/index.js");

const jsonSchema = z.toJSONSchema(schemas.lhciSchema);

const jsonString = JSON.stringify(jsonSchema);

await fsp.writeFile(path.join(outDirectory, "schema.json"), jsonString);

function build(options: Options) {
	return tsdown({
		attw: { excludeEntrypoints: ["schema.json"] },
		format: ["esm", "cjs"],
		outDir: outDirectory,
		skipNodeModulesBundle: true,
		target: "esnext",
		...options,
	});
}
