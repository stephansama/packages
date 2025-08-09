import { cosmiconfig, type Options } from "cosmiconfig";
import deepmerge from "deepmerge";
import * as path from "node:path";

import type { Args } from "./args";

import { INFO, WARN } from "./log";
import { configSchema } from "./schema";

export async function loadConfig(args: Args) {
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
		const file = path.relative(process.cwd(), search.filepath);
		INFO("found configuration file at: ", file);
		INFO("loaded cosmiconfig", search);
	}

	return configSchema.parse(
		deepmerge(args, search?.config || {}, {
			arrayMerge: (_, sourceArray) => sourceArray,
		}),
	);
}
