import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";

import { type Config, configSchema } from "./schema";
import { MODULE_NAME } from "./util";

const searchPlaces = getSearchPlaces();

const defaultConfig = {
	platforms: [["jsr", { experimentalGenerateJSR: true }]],
} satisfies Config;

export async function loadConfig() {
	const opts: Partial<Options> = { searchPlaces };

	const explorer = cosmiconfig(MODULE_NAME, opts);

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
