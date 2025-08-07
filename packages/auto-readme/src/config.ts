import chalk from "chalk";
import { cosmiconfig, type Options } from "cosmiconfig";
import * as path from "node:path";

import type { Args } from "./args";

import { configSchema } from "./config-schema";

export type Config = Awaited<ReturnType<typeof loadConfig>>;

export async function loadConfig(args: Args) {
	const opts: Partial<Options> = {};

	if (args.config) opts.searchPlaces = [args.config];

	const explorer = cosmiconfig("autoreadme", opts);

	const search = await explorer.search();

	if (!search) {
		const prefix = chalk.red("no config file found.");
		console.info(prefix, "returning default config");
	} else {
		const prefix = chalk.blue("loaded configuration file at:");
		const file = path.relative(process.cwd(), search.filepath);
		console.info(prefix, file);
	}

	return configSchema.parse(search?.config || args);
}
