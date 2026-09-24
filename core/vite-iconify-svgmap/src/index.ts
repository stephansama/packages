import type { Plugin, ResolvedConfig } from "vite";

import { getIconData } from "@iconify/utils/lib/icon-set/get-icon";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Options } from "./type";

import pkg from "../package.json";
import { generateSprite } from "./sprite";
import { getState, loadCollection, NAME_REGEX, STATE_KEY } from "./state";

export type { Options } from "./type";

export const VIRTUAL_MODULE_ID = "virtual:iconify-svgmap";
const RESOLVED_PREFIX = "\0";

const TRIM_SLASHES_REGEX = /^\/+|\/+$/g;
const QUERY_REGEX = /[?#]/;

const js = String.raw;

/**
 * Vite plugin that turns iconify icons into svg sprite maps
 *
 * - `import href from "virtual:iconify-svgmap/<pack>/<icon>"` resolves at build
 *   time and emits a content hashed `<pack>.svg` sprite through vite
 * - `import { getIcon } from "virtual:iconify-svgmap"` registers icons while
 *   pages render; call {@link writeSprites} after rendering to write their
 *   sprites (the `/astro` integration does this for you)
 */
export default function iconifySvgmap(options: Options = {}): Plugin {
	const state = getState();
	let config: ResolvedConfig;
	/** Vite's `base` with a trailing slash */
	let base = "/";

	/** Build time imports per vite environment: env -> pack -> icons */
	const usage = new Map<string, Map<string, Set<string>>>();
	/** Emitted sprite reference ids per vite environment: env -> pack -> ref */
	const references = new Map<string, Map<string, string>>();
	const referenceIds = new Set<string>();
	/** Emitted sprite reference id per env + static icon module id */
	const moduleReferences = new Map<string, string>();
	/** Dev sprites keyed by pack, valid while the icon count is unchanged */
	const developmentSprites = new Map<string, { size: number; svg: string }>();

	return {
		async buildEnd(error) {
			if (error) return;
			const key = environmentKey(this);
			const packs = usage.get(key);
			const packReferences = references.get(key);
			if (!packs || !packReferences) return;

			for (const [pack, icons] of packs) {
				const collection = await loadCollection(pack);
				const reference = packReferences.get(pack);
				if (!collection || !reference) continue;
				this.setAssetSource(
					reference,
					generateSprite(collection, icons).svg,
				);
			}
		},

		buildStart() {
			const key = environmentKey(this);
			usage.set(key, new Map());
			references.set(key, new Map());
			for (const moduleKey of moduleReferences.keys()) {
				if (moduleKey.startsWith(`${key}:`)) {
					moduleReferences.delete(moduleKey);
				}
			}
		},

		configResolved(resolvedConfig) {
			config = resolvedConfig;
			base = config.base.endsWith("/") ? config.base : `${config.base}/`;
			const spriteDirectory = (options.dir ?? "_iconify").replaceAll(
				TRIM_SLASHES_REGEX,
				"",
			);

			state.root = options.root ? toPath(options.root) : config.root;
			state.spriteDir = spriteDirectory;
			state.baseHref = `${base}${spriteDirectory}/`;
		},

		configureServer(server) {
			server.middlewares.use(function (request, response, next) {
				const url = request.url?.split(QUERY_REGEX)[0];
				const prefix = [state.baseHref, `/${state.spriteDir}/`].find(
					(candidate) => url?.startsWith(candidate),
				);
				if (!url || !prefix || !url.endsWith(".svg")) return next();

				const pack = url.slice(prefix.length, -".svg".length);
				if (!NAME_REGEX.test(pack)) return next();

				loadCollection(pack)
					.then((collection) => {
						if (!collection) return next();

						const icons = state.runtime.get(pack) ?? new Set();
						let sprite = developmentSprites.get(pack);
						if (sprite?.size !== icons.size) {
							sprite = {
								size: icons.size,
								svg: generateSprite(collection, icons).svg,
							};
							developmentSprites.set(pack, sprite);
						}

						response.setHeader("Cache-Control", "no-store");
						response.setHeader("Content-Type", "image/svg+xml");
						response.end(sprite.svg);
					})
					.catch(next);
			});
		},

		async load(id, loadOptions) {
			if (!id.startsWith(RESOLVED_PREFIX + VIRTUAL_MODULE_ID)) return;
			const request = id.slice(RESOLVED_PREFIX.length);
			const ssr =
				loadOptions?.ssr ??
				this.environment?.config.consumer === "server";

			if (request === VIRTUAL_MODULE_ID) {
				return createRuntimeModule(ssr);
			}

			const [pack, icon, ...rest] = request
				.slice(VIRTUAL_MODULE_ID.length + 1)
				.split("/");

			if (
				!pack ||
				!icon ||
				rest.length > 0 ||
				!NAME_REGEX.test(pack) ||
				!NAME_REGEX.test(icon)
			) {
				return this.error(
					`invalid icon import "${request}", expected "${VIRTUAL_MODULE_ID}/<pack>/<icon>"`,
				);
			}

			const collection = await loadCollection(pack);
			if (!collection) {
				return this.error(
					`unable to find icon pack "${pack}", is @iconify-json/${pack} installed?`,
				);
			}
			if (!getIconData(collection, icon)) {
				return this.error(
					`unable to find icon "${icon}" in icon pack "${pack}"`,
				);
			}

			if (config.command === "serve") {
				registerRuntimeIcon(pack, icon);
				return js`export default ${JSON.stringify(`${state.baseHref}${pack}.svg#${icon}`)};`;
			}

			const key = environmentKey(this, ssr);
			const packs = usage.get(key) ?? new Map<string, Set<string>>();
			const packReferences =
				references.get(key) ?? new Map<string, string>();
			usage.set(key, packs);
			references.set(key, packReferences);

			const icons = packs.get(pack) ?? new Set<string>();
			packs.set(pack, icons.add(icon));

			let reference = packReferences.get(pack);
			if (!reference) {
				reference = this.emitFile({
					name: `${pack}.svg`,
					type: "asset",
				});
				packReferences.set(pack, reference);
				referenceIds.add(reference);
			}
			moduleReferences.set(`${key}:${id}`, reference);

			return js`export default import.meta.ROLLUP_FILE_URL_${reference} + ${JSON.stringify(`#${icon}`)};`;
		},

		name: pkg.name,

		renderChunk(_code, chunk) {
			// list sprites as imported assets so they end up in vite's
			// manifest; frameworks (e.g. astro) use it to move assets
			// emitted by ssr builds into the client output
			const key = environmentKey(this);
			for (const moduleId of chunk.moduleIds) {
				const reference = moduleReferences.get(`${key}:${moduleId}`);
				if (!reference) continue;
				chunk.viteMetadata?.importedAssets.add(
					this.getFileName(reference),
				);
			}
		},

		resolveFileUrl({ fileName, referenceId }) {
			if (!referenceIds.has(referenceId)) return;
			// relative bases are left to the bundler's default resolution
			if (!base.startsWith("/")) return;
			return JSON.stringify(`${base}${fileName}`);
		},

		resolveId(id) {
			if (
				id === VIRTUAL_MODULE_ID ||
				id.startsWith(`${VIRTUAL_MODULE_ID}/`)
			) {
				return RESOLVED_PREFIX + id;
			}
		},
	};
}

/**
 * Write sprites for every icon registered with `getIcon` into
 * `<outDirectory>/<dir>/<pack>.svg`. call this after all pages have rendered.
 *
 * @returns The paths of the written sprites
 */
export async function writeSprites(outDirectory: string | URL) {
	const state = getState();
	const spriteDirectory = path.join(toPath(outDirectory), state.spriteDir);
	const written: string[] = [];

	for (const [pack, icons] of state.runtime) {
		if (icons.size === 0) continue;

		const collection = await loadCollection(pack);
		if (!collection) {
			console.warn(
				`[${pkg.name}] unable to find icon pack "${pack}", is @iconify-json/${pack} installed?`,
			);
			continue;
		}

		const { missing, svg } = generateSprite(collection, icons);
		for (const icon of missing) {
			console.warn(
				`[${pkg.name}] unable to find icon "${icon}" in icon pack "${pack}"`,
			);
		}

		const filename = path.join(spriteDirectory, `${pack}.svg`);
		await fs.promises.mkdir(spriteDirectory, { recursive: true });
		await fs.promises.writeFile(filename, svg);
		written.push(filename);
	}

	return written;
}

/** Module served for `virtual:iconify-svgmap` */
function createRuntimeModule(ssr: boolean) {
	const state = getState();
	const prefix = JSON.stringify(state.baseHref);
	const suffix = JSON.stringify(`.svg?v=${state.version}#`);

	const register = ssr
		? js`
const state = globalThis[Symbol.for(${JSON.stringify(STATE_KEY)})];
let icons = state?.runtime.get(pack);
if (state && !icons) state.runtime.set(pack, (icons = new Set()));
icons?.add(name);`
		: "";

	return js`
const NAME_REGEX = ${NAME_REGEX.toString()};

/** register an icon while rendering and return its sprite href */
export function getIcon(pack, name) {
	if (!NAME_REGEX.test(pack) || !NAME_REGEX.test(name)) {
		throw new Error("invalid icon " + JSON.stringify(pack + "/" + name));
	}
${register}
	return ${prefix} + pack + ${suffix} + name;
}
`;
}

function environmentKey(
	context: { environment?: { name: string } },
	ssr?: boolean,
) {
	return context.environment?.name ?? (ssr ? "ssr" : "client");
}

function registerRuntimeIcon(pack: string, icon: string) {
	const { runtime } = getState();
	const icons = runtime.get(pack) ?? new Set<string>();
	runtime.set(pack, icons.add(icon));
}

function toPath(value: string | URL) {
	return value instanceof URL || value.startsWith("file:")
		? fileURLToPath(value)
		: path.resolve(value);
}
