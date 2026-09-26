import type { Plugin } from "vite";

import fs from "node:fs";
import path from "node:path";

import type { Options } from "./type";

import pkg from "../package.json";
import iconifySvgmap, { writeSprites } from "./index";
import { getState, NAME_REGEX } from "./state";

const EMPTY_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none"></svg>`;
const JSON_EXTENSION_REGEX = /\.json$/;

/**
 * Vite plugins for sveltekit. add after `sveltekit()`:
 *
 * ```js
 * plugins: [sveltekit(), iconifySvgmap()];
 * ```
 *
 * Sveltekit prerenders in a worker thread during its server build's
 * `writeBundle` and runs the adapter in `closeBundle`:
 *
 * - When the client build is written, an empty placeholder sprite is added for
 *   every installed icon pack so the prerender crawler does not fail on `<use
 *   href>` links to sprites that do not exist yet
 * - After prerendering the real sprites replace the placeholders (unused ones are
 *   removed), before the adapter copies the client output
 */
export default function iconifySvgmapSvelteKit(
	options: Options = {},
): Plugin[] {
	const state = getState();

	return [
		iconifySvgmap(options),
		{
			apply: "build",
			name: `${pkg.name}:sveltekit`,
			writeBundle: {
				async handler(outputOptions) {
					if (!outputOptions.dir) return;
					const ssr = Boolean(this.environment?.config.build.ssr);

					if (!ssr) {
						await writePlaceholders(outputOptions.dir);
						return;
					}

					// `<kit.outDir>/output/server` -> `<kit.outDir>/output/client`
					const clientDirectory = path.resolve(
						outputOptions.dir,
						"..",
						"client",
					);
					const written = new Set(
						await writeSprites(clientDirectory),
					);
					for (const placeholder of state.placeholders) {
						if (!written.has(placeholder)) {
							await fs.promises.rm(placeholder, { force: true });
						}
					}
					state.placeholders.clear();

					if (written.size > 0) {
						this.info(`wrote ${written.size} svg sprite(s)`);
					}
				},
				order: "post",
				sequential: true,
			},
		},
	];

	async function writePlaceholders(clientDirectory: string) {
		const spriteDirectory = path.join(clientDirectory, state.spriteDir);
		await fs.promises.mkdir(spriteDirectory, { recursive: true });

		for (const pack of listInstalledPacks(state.root)) {
			const filename = path.join(spriteDirectory, `${pack}.svg`);
			if (fs.existsSync(filename)) continue;
			await fs.promises.writeFile(filename, EMPTY_SPRITE);
			state.placeholders.add(filename);
		}
	}
}

/** Icon packs resolvable from `root`, following node's module resolution */
function listInstalledPacks(root: string) {
	const packs = new Set<string>();
	let directory = path.resolve(root);

	while (true) {
		const modules = path.join(directory, "node_modules");
		for (const pack of readDirectory(path.join(modules, "@iconify-json"))) {
			if (NAME_REGEX.test(pack)) packs.add(pack);
		}
		for (const file of readDirectory(
			path.join(modules, "@iconify", "json", "json"),
		)) {
			const pack = file.replace(JSON_EXTENSION_REGEX, "");
			if (NAME_REGEX.test(pack)) packs.add(pack);
		}

		const parent = path.dirname(directory);
		if (parent === directory) return packs;
		directory = parent;
	}
}

function readDirectory(directory: string) {
	try {
		return fs.readdirSync(directory);
	} catch {
		return [];
	}
}
