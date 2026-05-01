#!/usr/bin/env node

import * as fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { CONFIG_FILENAME, defaultConfig, LOADED_ICONS_FILENAME } from "./const";
import { buildEnd, loadIcons } from "./utilities";

const {
	values: { config },
} = parseArgs({
	options: {
		config: {
			default: path.resolve(CONFIG_FILENAME),
			short: "c",
			type: "string",
		},
	},
});

const configFile = fs.readFileSync(config, { encoding: "utf8" });
const options = (JSON.parse(configFile || "false") || defaultConfig) as object;
const usage = JSON.parse(
	fs.readFileSync(path.resolve(LOADED_ICONS_FILENAME), {
		encoding: "utf8",
	}) || "{}",
) as Record<string, string[]>;

try {
	const icons = await loadIcons(options);
	buildEnd(icons, usage, options);
} catch (error) {
	console.error(error);
}
