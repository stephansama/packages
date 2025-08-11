import toml from "@iarna/toml";
import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";
import deepmerge from "deepmerge";

import type { Args } from "./args";

import { INFO, WARN } from "./log";
import { configSchema } from "./schema";

const moduleName = "autoreadme";

const searchPlaces = getSearchPlaces();

const loaders = { [".toml"]: loadToml };

export async function loadConfig(args: Partial<Args>) {
	const opts: Partial<Options> = { loaders, searchPlaces };

	if (args.config) opts.searchPlaces = [args.config];

	const explorer = cosmiconfig(moduleName, opts);

	const search = await explorer.search();

	if (!search) {
		const location = args.config ? " at location: " + args.config : "";
		WARN(`no config file found`, location);
		INFO("using default configuration");
	} else {
		INFO("found configuration file at: ", search.filepath);
		INFO("loaded cosmiconfig", search.config);
	}

	args = removeFalsy(args);

	INFO("merging config with args", args);

	return configSchema.parse(
		deepmerge(search?.config || {}, args, {
			arrayMerge: (_, sourceArray) => sourceArray,
		}),
	);
}

export function removeFalsy(obj: object) {
	return Object.fromEntries(
		Object.entries(obj)
			.map(([k, v]) => (!v ? false : [k, v]))
			.filter((e): e is [string, unknown] => Boolean(e)),
	);
}

function getSearchPlaces() {
	return [
		...getDefaultSearchPlaces(moduleName),
		`.${moduleName}rc.toml`,
		`.config/.${moduleName}rc`,
		`.config/${moduleName}rc.toml`,
		`.config/.${moduleName}rc.toml`,
		`.config/.${moduleName}rc.json`,
		`.config/.${moduleName}rc.yaml`,
		`.config/.${moduleName}rc.yml`,
	];
}

function loadToml(_filepath: string, content: string) {
	return toml.parse(content);
}
