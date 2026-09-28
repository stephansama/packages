/// <reference types="@vitejs/devtools-kit" />
import type { Plugin } from "vite";

import type { Options, Screens } from "./type";

import pkg from "../package.json";
import { CLIENT_SOURCE, REPORT_PATH } from "./client";
import { loadScreensFromConfigFile } from "./config";
import {
	buildLabelIcon,
	buildSpec,
	labelFor,
	readWidth,
	type Snapshot,
} from "./internal";

export type { Options, Screens } from "./type";

const DOCK_ID = "vite-devtools-tailwind-debug-screens";

/** Tailwind css's default `screens` config, in ascending order. */
export const DEFAULT_SCREENS: Screens = [
	{ name: "sm", value: "640px" },
	{ name: "md", value: "768px" },
	{ name: "lg", value: "1024px" },
	{ name: "xl", value: "1280px" },
	{ name: "2xl", value: "1536px" },
];

/**
 * Vite devtool that surfaces the active tailwind breakpoint inside the
 * `@vitejs/devtools` dock - no floating badge, no overlay. Open the `Tailwind
 * Screens` dock to see the current viewport width, the active breakpoint, and
 * the configured screens.
 */
export default function tailwindDebugScreens(options: Options = {}): Plugin {
	let screens: Screens = options.screens ?? DEFAULT_SCREENS;
	let latest: Snapshot = { active: labelFor(screens, 0), width: 0 };
	let apply: ((snapshot: Snapshot) => void) | undefined;
	let currentIconLabel: string | undefined;

	return {
		apply: "serve",

		async configResolved(config) {
			if (options.screens || !options.configFile) return;
			const loaded = await loadScreensFromConfigFile(
				options.configFile,
				config.root,
				DEFAULT_SCREENS,
			);
			if (!loaded?.length) return;
			screens = loaded;
			latest = {
				active: labelFor(screens, latest.width),
				width: latest.width,
			};
		},

		configureServer(server) {
			server.middlewares.use(REPORT_PATH, (request, response) => {
				if (request.method !== "POST") {
					response.statusCode = 405;
					response.end();
					return;
				}
				const chunks: Buffer[] = [];
				request.on("data", (chunk: Buffer) => chunks.push(chunk));
				request.on("end", () => {
					const width = readWidth(
						Buffer.concat(chunks).toString("utf8"),
					);
					if (width !== undefined) {
						latest = { active: labelFor(screens, width), width };
						apply?.(latest);
					}
					response.statusCode = 204;
					response.end();
				});
			});
		},

		devtools: {
			setup(context) {
				const ui = context.createJsonRenderer(
					buildSpec(screens, latest),
				);
				currentIconLabel = latest.active;
				const entry = context.docks.register({
					icon: buildLabelIcon(currentIconLabel),
					id: DOCK_ID,
					title: "Tailwind Screens",
					type: "json-render",
					view: ui.view,
				});
				apply = (snapshot) => {
					void ui.updateSpec(buildSpec(screens, snapshot));
					if (snapshot.active !== currentIconLabel) {
						currentIconLabel = snapshot.active;
						entry.update({
							icon: buildLabelIcon(currentIconLabel),
						});
					}
				};
			},
		},

		name: pkg.name,

		transformIndexHtml: {
			handler: () => [
				{
					attrs: { type: "module" },
					children: CLIENT_SOURCE,
					injectTo: "body",
					tag: "script",
				},
			],
			order: "post",
		},
	};
}
