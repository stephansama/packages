import type { Options } from "./type";

const FILE_PREFIX = "node_modules/";

export const CONFIG_FILENAME = FILE_PREFIX + "iconifysvgmap.config.json";

export const LOADED_ICONS_FILENAME = FILE_PREFIX + "iconifysvgmap.json";

export const defaultConfig: Options = {
	outDir: "public",
};
