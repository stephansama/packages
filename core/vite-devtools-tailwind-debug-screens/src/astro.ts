import type { AstroIntegration } from "astro";

import type { Options } from "./type";

import pkg from "../package.json";
import { CLIENT_SOURCE } from "./client";
import tailwindDebugScreens from "./index";

/**
 * Astro integration wrapper. Registers the vite plugin AND injects the
 * viewport-reporter client script on every rendered page via
 * `injectScript("page", …)`. `transformIndexHtml` on its own does not fire for
 * `.astro`-rendered pages in Astro's dev pipeline, so plugin-only setups leave
 * the dock stuck at "waiting for browser".
 */
export default function tailwindDebugScreensIntegration(
	options: Options = {},
): AstroIntegration {
	return {
		name: pkg.name,
		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			"astro:config:setup"({ command, injectScript, updateConfig }) {
				if (command !== "dev") return;
				updateConfig({
					// astro may bundle a different vite major than the one installed
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					vite: { plugins: [tailwindDebugScreens(options) as any] },
				});
				injectScript("page", CLIENT_SOURCE);
			},
		},
	};
}
