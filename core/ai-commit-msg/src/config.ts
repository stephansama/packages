import {
	cosmiconfig,
	defaultLoaders,
	getDefaultSearchPlaces,
	type Loader,
	type Options,
} from "cosmiconfig";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import xdgAppPaths from "xdg-app-paths";

import { type Config, configSchema } from "./schema";
import { moduleName } from "./utilities";

const searchPlaces = getSearchPlaces();

const tomlLoader: Loader = (_filepath, content) => parseToml(content);

const loaders = {
	...defaultLoaders,
	".toml": tomlLoader,
};

const defaultConfig = {
	model: "llama2",
	provider: "ollama",
	useConventionalCommits: true,
} satisfies Config;

export async function loadConfig() {
	const options: Partial<Options> = { loaders, searchPlaces };

	const explorer = cosmiconfig(moduleName, options);

	const result = await explorer.search();

	return configSchema.parse(result?.config || defaultConfig);
}

function getSearchPlaces() {
	// XDG paths come AFTER project-local paths, so project config wins.
	const xdgConfigDirectory = path.join(
		xdgAppPaths(moduleName).config(),
		"config",
	);

	return [
		...getDefaultSearchPlaces(moduleName),
		`.config/.${moduleName}rc.json`,
		`.config/.${moduleName}rc.yaml`,
		`.config/.${moduleName}rc.yml`,
		`.config/.${moduleName}rc`,
		`${xdgConfigDirectory}.json`,
		`${xdgConfigDirectory}.yaml`,
		`${xdgConfigDirectory}.yml`,
		`${xdgConfigDirectory}.toml`,
	];
}
