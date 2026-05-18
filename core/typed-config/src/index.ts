import type { StandardSchemaV1 } from "@standard-schema/spec";

import {
	cosmiconfig,
	defaultLoaders,
	getDefaultSearchPlaces,
	type Loader,
} from "cosmiconfig";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import xdgAppPaths from "xdg-app-paths";

export interface ConfigResult<T> {
	config: T;
	filepath: string | undefined;
}

export interface CreateConfigOptions<T> {
	/** Explicit defaults merged into the validator input before validation. */
	defaults?: Partial<T>;
	/** Module name used for cosmiconfig file discovery + XDG path resolution. */
	name: string;
	/** Standard-Schema-compliant validator (e.g. a zod schema). Required. */
	schema: StandardSchemaV1<unknown, T>;
	/** Also search `$XDG_CONFIG_HOME/<name>/config.{json,yaml,yml,toml}`. */
	xdg?: boolean;
}

const tomlLoader: Loader = (_filepath, content) => parseToml(content);

/**
 * Load a config file using cosmiconfig + smol-toml + (optional) XDG paths, then
 * validate the merged value through the supplied Standard-Schema-V1 validator.
 * Returns the fully-typed config plus the filepath it came from (`undefined` if
 * no file was found and defaults were used).
 */
export async function createConfig<T>(
	options: CreateConfigOptions<T>,
): Promise<ConfigResult<T>> {
	const { defaults = {}, name, schema, xdg = false } = options;

	const loaders = { ...defaultLoaders, ".toml": tomlLoader };
	const searchPlaces = buildSearchPlaces(name, xdg);

	const explorer = cosmiconfig(name, { loaders, searchPlaces });
	const found = await explorer.search();
	const raw = found?.config as Partial<T> | undefined;

	const merged: unknown = { ...defaults, ...raw };
	const validated = await validate(schema, merged);
	return { config: validated, filepath: found?.filepath };
}

function buildSearchPlaces(name: string, xdg: boolean): string[] {
	const base = [
		...getDefaultSearchPlaces(name),
		`.config/.${name}rc.json`,
		`.config/.${name}rc.yaml`,
		`.config/.${name}rc.yml`,
		`.config/.${name}rc.toml`,
		`.config/.${name}rc`,
	];
	if (!xdg) return base;
	const xdgDirectory = path.join(xdgAppPaths(name).config(), "config");
	return [
		...base,
		`${xdgDirectory}.json`,
		`${xdgDirectory}.yaml`,
		`${xdgDirectory}.yml`,
		`${xdgDirectory}.toml`,
	];
}

async function validate<T>(
	schema: StandardSchemaV1<unknown, T>,
	value: unknown,
): Promise<T> {
	const result = await schema["~standard"].validate(value);
	if ("issues" in result && result.issues) {
		const messages = result.issues.map((issue) => issue.message).join("; ");
		throw new Error(`Invalid config: ${messages}`);
	}
	return (result as { value: T }).value;
}
