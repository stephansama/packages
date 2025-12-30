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
import { buildEnd, generateSprite, loadIcons } from "./util.ts";

const PLUGIN_NAME = pkg.name;
const virtualModuleId = "virtual:iconify-svgmap";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

const js = String.raw;

import type { AstroIntegration } from "astro";

export function createIntegration(opts: Options = {}): AstroIntegration {
	return {
		name: "astro-icon",
		// eslint-disable-next-line
		hooks: {
			async "astro:build:done"(o) {
				console.log("starting build done");

				const configFile = fs.readFileSync(
					path.resolve(CONFIG_FILENAME),
					{ encoding: "utf8" },
				);
				const options =
					JSON.parse(configFile || "false") || defaultConfig;
				const usage = JSON.parse(
					fs.readFileSync(path.resolve(LOADED_ICONS_FILENAME), {
						encoding: "utf8",
					}) || "{}",
				);
				const icons = await loadIcons(opts);
				buildEnd(icons, usage, options);
			},
			"astro:config:setup"({ config, logger, updateConfig }) {
				updateConfig({
					vite: {
						// @ts-expect-error correctly typed
						plugins: [createPlugin(opts)],
					},
				});
			},
		},
	};
}

export default function createPlugin(options?: Options): Plugin {
	let config: ResolvedConfig;
	let inMemoryCollections: Record<string, IconifyJSON> = {};

	fs.writeFileSync(path.resolve(CONFIG_FILENAME), JSON.stringify(options));

	return {
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				for (const pack of Object.keys(inMemoryCollections)) {
					if (req.url === `/${pack}.svg`) {
						const loaded = JSON.parse(
							fs.readFileSync(
								path.resolve(LOADED_ICONS_FILENAME),
								{
									encoding: "utf8",
									flag: "as+",
								},
							) || "{}",
						);
						res.setHeader("Content-Type", "image/svg+xml");
						const sprite = generateSprite(
							inMemoryCollections[pack],
							loaded[pack] || [],
						);
						return res.end(sprite);
					}
				}

				return next();
			});
		},

		async load(id) {
			if (id !== resolvedVirtualModuleId) return;
			inMemoryCollections = await loadIcons(options || defaultConfig);

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
