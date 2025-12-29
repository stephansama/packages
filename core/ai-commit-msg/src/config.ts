import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";
import { merge } from "es-toolkit/compat";

import { configSchema, defaultConfig } from "./schema";
import { moduleName } from "./util";

const searchPlaces = getSearchPlaces();

export async function loadConfig() {
	const opts: Partial<Options> = { searchPlaces };

	const explorer = cosmiconfig(moduleName, opts);

	const result = await explorer.search();

	return configSchema.parse(merge(result?.config || defaultConfig, {}));
}

function getSearchPlaces() {
	return [
		...getDefaultSearchPlaces(moduleName),
		`.config/.${moduleName}rc.json`,
		`.config/.${moduleName}rc.yaml`,
		`.config/.${moduleName}rc.yml`,
		`.config/.${moduleName}rc`,
	];
}
