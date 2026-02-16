import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { type Options, build as tsdown } from "tsdown";
import * as z from "zod";

const outDir = path.resolve("./dist");

await build({
	dts: true,
	entry: ["./src/index.ts"],
	exports: true,
});

const schemas = await import("./dist/index.js");

const jsonSchema = z.toJSONSchema(schemas.lhciSchema);

const jsonString = JSON.stringify(jsonSchema);

await fsp.writeFile(path.join(outDir, "schema.json"), jsonString);

function build(opts: Options) {
	return tsdown({
		attw: { excludeEntrypoints: ["schema.json"] },
		format: ["esm", "cjs"],
		outDir,
		skipNodeModulesBundle: true,
		target: "esnext",
		...opts,
	});
}
