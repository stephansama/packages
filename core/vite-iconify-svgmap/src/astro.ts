import type { AstroIntegration } from "astro";

import type { Options } from "./type";

import pkg from "../package.json";
import iconifySvgmap, { writeSprites } from "./index";

/**
 * Astro integration that adds the vite plugin and writes sprites for icons
 * registered with `getIcon` once every page has been rendered
 */
export default function iconifySvgmapIntegration(
	options: Options = {},
): AstroIntegration {
	return {
		name: pkg.name,
		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			async "astro:build:done"({ dir, logger }) {
				const written = await writeSprites(dir);
				if (written.length > 0) {
					logger.info(`wrote ${written.length} svg sprite(s)`);
				}
			},
			"astro:config:setup"({ updateConfig }) {
				updateConfig({
					// astro may bundle a different vite major than the one installed
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					vite: { plugins: [iconifySvgmap(options) as any] },
				});
			},
		},
	};
}
