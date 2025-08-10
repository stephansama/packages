import { cosmiconfig, type Options } from "cosmiconfig";
import deepmerge from "deepmerge";

import type { Args } from "./args";

import { INFO, WARN } from "./log";
import { configSchema } from "./schema";

export async function loadConfig(args: Partial<Args>) {
	const opts: Partial<Options> = {};

	if (args.config) opts.searchPlaces = [args.config];

	/* cspell:disable-next-line configuration filename */
	const explorer = cosmiconfig("autoreadme", opts);

	const search = await explorer.search();

	if (!search) {
		const location = args.config ? " at location: " + args.config : "";
		WARN(`no config file found`, location);
		INFO("using default configuration");
	} else {
		INFO("found configuration file at: ", search.filepath);
		INFO("loaded cosmiconfig", search.config);
	}

	// delete complex keys from args that cannot be passed
	delete args.removeScope;
	delete args.affectedRegexes;
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
