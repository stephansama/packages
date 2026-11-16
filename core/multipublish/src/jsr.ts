import type { Package } from "@manypkg/get-packages";

import * as fsp from "node:fs/promises";
import { glob } from "tinyglobby";
import * as z from "zod";

import type { JsrPlatformOptionsSchema } from "./schema";

export type ExportsSchema = string | { [subpath: string]: ConditionalExports };
type ConditionalExports = string | { [condition: string]: ConditionalExports };

/**
 * Package.json conditional exports value: a file path (`string`) or a recursive
 * record of condition keys - `import`, `require`, `default`, `node`, `browser`,
 * `types`, `svelte`, custom conditions, ... - each resolving to another
 * conditional exports value.
 */
const conditionalExportsSchema: z.ZodType<ConditionalExports> = z.lazy(() =>
	z.string().trim().or(z.record(z.string(), conditionalExportsSchema)),
);

export const exportSchema = z
	.string()
	.trim()
	.or(z.record(z.string(), conditionalExportsSchema));

/**
 * Runtime conditions we prefer, in order. jsr is an esm-only registry, so
 * `import` / `module` come before the `default` catch-all - otherwise a dual `{
 * import: "./esm.mjs", default: "./cjs.js" }` package would publish the cjs
 * file, which jsr can't accept. `types` is intentionally NOT here - jsr needs a
 * runtime module reference, not a type declaration.
 */
const RUNTIME_CONDITIONS = [
	"import",
	"module",
	"default",
	"node",
	"browser",
	"require",
];

export const packageJsonSchema = z.object({
	exports: exportSchema,
	license: z.string().trim().optional(),
	name: z.string().trim().min(1),
	version: z.string().trim(),
});

export const jsrTransformer = packageJsonSchema.transform((schema) => ({
	exports: convertPackageJsonExportsToJsr(schema.exports),
	license: schema.license,
	name: schema.name,
	version: schema.version,
}));

export { jsrTransformer as transformer };

const leadingDotSlashRegex = /^\.\//;

const globListSchema = z.array(z.string().trim()).optional();

export type JsrSchema = z.infer<typeof jsrSchema>;
export const jsrSchema = z.object({
	exclude: globListSchema,
	exports: z
		.string()
		.trim()
		.or(z.array(z.string().trim()))
		.or(z.record(z.string(), z.string().trim())),
	include: globListSchema,
	license: z.string().trim().optional(),
	name: z.string().trim().min(1),
	/**
	 * Publish-only file filters. Unlike the top-level `include` / `exclude`, a
	 * negated `publish.exclude` glob (`!dist`) can publish gitignored files.
	 */
	publish: z
		.object({ exclude: globListSchema, include: globListSchema })
		.optional(),
	version: z.string().trim(),
});

/**
 * Un-exclude every directory the config's `exports` point into, e.g. `!dist`
 * for `./dist/index.mjs`. Build output is usually gitignored, and jsr excludes
 * gitignored files, so without this every export would fail with
 * `excluded-module`.
 *
 * The globs are prepended, because jsr uses the last matching glob: a narrower
 * exclude inside the directory (e.g. `dist/*.map`) has to come after `!dist` to
 * still apply. A directory that's already listed keeps its position.
 */
export function includeExportDirectories(jsrConfig: JsrSchema) {
	const exportPaths =
		typeof jsrConfig.exports === "string"
			? [jsrConfig.exports]
			: Object.values(jsrConfig.exports);

	const directories = exportPaths.flatMap((exportPath) => {
		const [directory, ...rest] = exportPath
			.replace(leadingDotSlashRegex, "")
			.split("/");
		return directory && rest.length > 0 ? [`!${directory}`] : [];
	});

	const existing = jsrConfig.publish?.exclude ?? [];
	const missing = [...new Set(directories)].filter(
		(directory) => !existing.includes(directory),
	);
	if (missing.length === 0) return;

	jsrConfig.publish ??= {};
	jsrConfig.publish.exclude = [...missing, ...existing];
}

export async function loadConfig(basePath: string) {
	const files = await glob(basePath + "/{deno,jsr}.json{,c}");
	if (files.length > 1) {
		throw new Error("please only have one deno or jsr configuration file");
	}

	const configFile = files.at(0);
	if (!configFile) {
		console.info("no jsr config file found");
		return { config: undefined, filename: undefined };
	}

	const file = await fsp.readFile(configFile, { encoding: "utf8" });
	return { config: jsrSchema.parse(JSON.parse(file)), filename: configFile };
}

/**
 * Add the jsr platform's `defaultInclude` / `defaultExclude` to the config's
 * `publish.include` / `publish.exclude`. They go under `publish` because jsr
 * only honors negated globs like `!dist` (which publish gitignored files)
 * there, not in the top-level `exclude`.
 */
export function updateIncludeExcludeList(
	jsrConfig: JsrSchema,
	appConfig: JsrPlatformOptionsSchema,
) {
	addPublishGlobs(jsrConfig, "include", appConfig.defaultInclude);
	addPublishGlobs(jsrConfig, "exclude", appConfig.defaultExclude);
}

export async function updateJsrConfigVersion(
	pkg: Package & { version: string },
) {
	const userJsr = await loadConfig(pkg.dir);
	if (!userJsr.config || !userJsr.filename) {
		throw new Error("unable to load user provided deno/jsr config file");
	}

	userJsr.config.version = pkg.version;

	await fsp.writeFile(
		userJsr.filename,
		JSON.stringify(userJsr.config, undefined, 2),
		"utf8",
	);
}

function addPublishGlobs(
	jsrConfig: JsrSchema,
	key: "exclude" | "include",
	globs: string[] = [],
) {
	if (globs.length === 0) return;
	jsrConfig.publish ??= {};
	const existing = jsrConfig.publish[key] ?? [];
	jsrConfig.publish[key] = [...new Set([...existing, ...globs])];
}

function convertPackageJsonExportsToJsr(exports: ExportsSchema) {
	if (typeof exports === "string") return exports;
	const keys = Object.keys(exports);
	// node treats a top-level exports record with no `.`-prefixed keys as the
	// `.` entry itself (`{ import, require }` sugar); walk it as one value
	// so `types`-only sugar and custom conditions collapse to a single subpath
	if (keys.length > 0 && keys.every((key) => !key.startsWith("."))) {
		const path = pickRuntimePath(exports);
		return path ? { ".": path } : {};
	}
	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(exports)) {
		const path = pickRuntimePath(value);
		if (path) result[key] = path;
	}
	return result;
}

/**
 * Walk a conditional exports value and return the first runtime module path we
 * can resolve. Prefers well-known runtime conditions
 * ({@link RUNTIME_CONDITIONS}); falls back to any non-`types` string value so
 * custom conditions like `svelte` or `deno` still work.
 */
function pickRuntimePath(value: ConditionalExports): string | undefined {
	if (typeof value === "string") return value;
	for (const condition of RUNTIME_CONDITIONS) {
		const inner = value[condition];
		if (inner !== undefined) {
			const resolved = pickRuntimePath(inner);
			if (resolved) return resolved;
		}
	}
	for (const [condition, inner] of Object.entries(value)) {
		if (condition === "types") continue;
		const resolved = pickRuntimePath(inner);
		if (resolved) return resolved;
	}
	return undefined;
}
