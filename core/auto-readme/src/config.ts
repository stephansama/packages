import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";
import deepmerge from "deepmerge";
import * as toml from "smol-toml";

import type { Arguments } from "./arguments";

import { INFO, WARN } from "./log";
import { configSchema } from "./schema";

const moduleName = "autoreadme";

const searchPlaces = getSearchPlaces();

const loaders = { [".toml"]: loadToml };

export async function loadConfig(arguments_: Partial<Arguments>) {
	const options: Partial<Options> = { loaders, searchPlaces };

	if (arguments_.config) options.searchPlaces = [arguments_.config];

	const explorer = cosmiconfig(moduleName, options);

	const search = await explorer.search();

	if (search) {
		INFO("found configuration file at: ", search.filepath);
		INFO("loaded cosmiconfig", search.config);
	} else {
		const location = arguments_.config
			? " at location: " + arguments_.config
			: "";
		WARN(`no config file found`, location);
		INFO("using default configuration");
	}

	arguments_ = removeFalsy(arguments_);

	INFO("merging config with args", arguments_);

	return configSchema.parse(
		deepmerge((search?.config as object) || {}, arguments_, {
			arrayMerge: (_, sourceArray) => sourceArray as unknown[],
		}),
	);
}

export function loadToml(_filepath: string, content: string) {
	return toml.parse(content);
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

function removeFalsy(object: object) {
	return Object.fromEntries(
		// @ts-expect-error some sort of mismatch
		Object.entries(object)
			.map(([k, v]) => (v ? [k, v] : false))
			.filter(Boolean),
	);
}
