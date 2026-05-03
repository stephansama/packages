import type { IconifyJSON } from "@iconify/types";
import type { Plugin, ResolvedConfig } from "vite";

import fs from "node:fs";
import path from "node:path";

import type { Options } from "./type.ts";

import pkg from "../package.json";
import {
	CONFIG_FILENAME,
	defaultConfig,
	LOADED_ICONS_FILENAME,
} from "./const.ts";
import { buildEnd, generateSprite, loadIcons } from "./utilities";

const PLUGIN_NAME = pkg.name;
const virtualModuleId = "virtual:iconify-svgmap";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

const js = String.raw;

import type { AstroIntegration } from "astro";

export function createIntegration(options_: Options = {}): AstroIntegration {
	return {
		name: "astro-icon",
		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			async "astro:build:done"(_) {
				console.log("starting build done");

				const configFile = fs.readFileSync(
					path.resolve(CONFIG_FILENAME),
					{ encoding: "utf8" },
				);
				const options = (JSON.parse(configFile || "false") ||
					defaultConfig) as object;
				const usage = JSON.parse(
					fs.readFileSync(path.resolve(LOADED_ICONS_FILENAME), {
						encoding: "utf8",
					}) || "{}",
				) as Record<string, string[]>;
				const icons = await loadIcons(options_);
				buildEnd(icons, usage, options);
			},
			"astro:config:setup"({ updateConfig }) {
				updateConfig({
					vite: {
						// @ts-expect-error correctly typed
						plugins: [createPlugin(options_)],
					},
				});
			},
		},
	};
}

export default function createPlugin(options?: Options): Plugin {
	let _config: ResolvedConfig;
	let inMemoryCollections: Record<string, IconifyJSON> = {};

	fs.writeFileSync(path.resolve(CONFIG_FILENAME), JSON.stringify(options));

	return {
		configResolved(resolvedConfig) {
			_config = resolvedConfig;
		},
		configureServer(server) {
			server.middlewares.use(function (request, response, next) {
				for (const pack of Object.keys(inMemoryCollections)) {
					if (request.url === `/${pack}.svg`) {
						const loaded = JSON.parse(
							fs.readFileSync(
								path.resolve(LOADED_ICONS_FILENAME),
								{
									encoding: "utf8",
									flag: "as+",
								},
							) || "{}",
						) as Record<string, string[]>;
						response.setHeader("Content-Type", "image/svg+xml");
						const sprite = generateSprite(
							inMemoryCollections[pack],
							loaded[pack] || [],
						);
						return response.end(sprite);
					}
				}

				return next();
			});
		},

		async load(id) {
			if (id !== resolvedVirtualModuleId) return;
			inMemoryCollections =
				(await loadIcons(options || defaultConfig)) || {};

			return js`export default ${JSON.stringify(inMemoryCollections)};`;
		},

		name: PLUGIN_NAME,

		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
	};
}
