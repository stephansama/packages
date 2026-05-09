import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";

import type { Arguments } from "./arguments";

import { type Config, configSchema } from "./schema";
import { MODULE_NAME } from "./utilities";

const searchPlaces = getSearchPlaces();

const defaultConfig = {
	platforms: [["jsr", { experimentalGenerateJSR: true }]],
} satisfies Config;

export async function loadConfig(arguments_: Arguments) {
	const options: Partial<Options> = { searchPlaces };

	if (arguments_.config) options.searchPlaces = [arguments_.config];

	const explorer = cosmiconfig(MODULE_NAME, options);

	const result = await explorer.search();

	return configSchema.parse(result?.config || defaultConfig);
}

function getSearchPlaces() {
	return [
		...getDefaultSearchPlaces(MODULE_NAME),
		`.config/.${MODULE_NAME}rc.json`,
		`.config/.${MODULE_NAME}rc.yaml`,
		`.config/.${MODULE_NAME}rc.yml`,
		`.config/.${MODULE_NAME}rc`,
	];
}
