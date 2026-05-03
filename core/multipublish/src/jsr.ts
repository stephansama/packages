import type { Package } from "@manypkg/get-packages";

import * as fsp from "node:fs/promises";
import { glob } from "tinyglobby";
import * as z from "zod";

import type { JsrPlatformOptionsSchema } from "./schema";

type ExportsSchema = z.infer<typeof exportSchema>;
export const exportSchema = z
	.string()
	.trim()
	.or(
		z.record(
			z.string(),
			z
				.string()
				.trim()
				.or(
					z.object({
						import: z
							.object({ default: z.string().trim() })
							.or(z.string().trim()),
						require: z
							.object({ default: z.string().trim() })
							.or(z.string().trim()),
					}),
				),
		),
	);

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

export type JsrSchema = z.infer<typeof jsrSchema>;
export const jsrSchema = z.object({
	exclude: z.array(z.string().trim()).optional(),
	exports: z
		.string()
		.trim()
		.or(z.array(z.string().trim()))
		.or(z.record(z.string(), z.string().trim())),
	include: z.array(z.string().trim()).optional(),
	license: z.string().trim().optional(),
	name: z.string().trim().min(1),
	version: z.string().trim(),
});

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

export function updateIncludeExcludeList(
	jsrConfig: JsrSchema,
	appConfig: JsrPlatformOptionsSchema,
) {
	for (const key of ["include", "exclude"] as const) {
		const capitalizedKey = key.at(0)?.toUpperCase() + key.slice(1);
		const appConfigKey =
			`default${capitalizedKey}` as `default${Capitalize<typeof key>}`;
		const appConfigList = appConfig[appConfigKey] || [];

		jsrConfig[key] ??= [];
		jsrConfig[key] = [...jsrConfig[key], ...appConfigList];
	}
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

function convertPackageJsonExportsToJsr(exports: ExportsSchema) {
	if (typeof exports === "string") return exports;
	return Object.fromEntries(
		Object.entries(exports).map(([key, value]) => {
			let current: string | undefined;
			if (typeof value === "string") current = value;
			else if (typeof value.import === "string") current = value.import;
			else current = value.import.default;
			return [key, current];
		}),
	);
}
