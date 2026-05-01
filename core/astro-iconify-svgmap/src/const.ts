import type { Options } from "./type";

const FILE_PREFIX = "node_modules/" as const;

export const CONFIG_FILENAME =
	`${FILE_PREFIX}iconifysvgmap.config.json` as const;

export const LOADED_ICONS_FILENAME =
	`${FILE_PREFIX}iconifysvgmap.json` as const;

export const defaultConfig: Options = {
	outDir: "public",
} as const;
