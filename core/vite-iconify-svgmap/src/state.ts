import type { IconifyJSON } from "@iconify/types";

import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

export const STATE_KEY = "@stephansama/vite-iconify-svgmap";

/** Valid iconify pack / icon names; also guards file paths built from them */
export const NAME_REGEX = /^[\w-]+$/;

export interface State {
	/** Public path prefix for render time sprites, e.g. `/_iconify/` */
	baseHref: string;
	collections: Map<string, Promise<IconifyJSON | undefined>>;
	/** Directory used to resolve `@iconify-json/*` packages */
	root: string;
	/** Icons registered through `getIcon` while pages render, keyed by pack */
	runtime: Map<string, Set<string>>;
	/**
	 * Folder (relative to the output directory) render time sprites are written
	 * to
	 */
	spriteDir: string;
	/** Cache busting id appended to render time sprite urls */
	version: string;
}

/**
 * Process wide state shared by the vite plugin, the rendered `getIcon` calls
 * and `writeSprites`. stored on `globalThis` so every copy of this module
 * (bundled, externalized or loaded by vite's module runner) sees the same
 * registry.
 */
export function getState(): State {
	const store = globalThis as typeof globalThis & {
		[key: symbol]: State | undefined;
	};
	const key = Symbol.for(STATE_KEY);

	store[key] ??= {
		baseHref: "/_iconify/",
		collections: new Map(),
		root: process.cwd(),
		runtime: new Map(),
		spriteDir: "_iconify",
		version: Date.now().toString(36),
	};

	return store[key];
}

export function loadCollection(pack: string) {
	const state = getState();
	let collection = state.collections.get(pack);

	if (!collection) {
		// a trailing slash makes node resolution start inside `root`
		const cwd = state.root.endsWith("/") ? state.root : `${state.root}/`;
		collection = loadCollectionFromFS(pack, false, "@iconify-json", cwd);
		state.collections.set(pack, collection);
	}

	return collection;
}
