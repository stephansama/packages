import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";

import { type Config, configSchema } from "./schema";
import { moduleName } from "./util";

const searchPlaces = getSearchPlaces();

const defaultConfig = {
	model: "llama2",
	provider: "ollama",
	useConventionalCommits: true,
} satisfies Config;

export async function loadConfig() {
	const opts: Partial<Options> = { searchPlaces };

	const explorer = cosmiconfig(moduleName, opts);

	const result = await explorer.search();

	return configSchema.parse(result?.config || defaultConfig);
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
