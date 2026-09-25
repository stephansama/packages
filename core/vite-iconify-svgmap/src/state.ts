import type { IconifyJSON } from "@iconify/types";

import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

export const STATE_KEY = "@stephansama/vite-iconify-svgmap";

/** Valid iconify pack / icon names; also guards file paths built from them */
export const NAME_REGEX = /^[\w-]+$/;

export interface State {
	/** Public path prefix for render time sprites, e.g. `/_iconify/` */
	baseHref: string;
	collections: Map<string, Promise<IconifyJSON | undefined>>;
	/** Placeholder sprite files that still need a real sprite or removal */
	placeholders: Set<string>;
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

/** Let pending worker messages reach the registry */
export async function flushWorkerIcons() {
	for (let tick = 0; tick < 3; tick++) {
		await new Promise((resolve) => setImmediate(resolve));
	}
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

	if (!store[key]) {
		const state: State = {
			baseHref: "/_iconify/",
			collections: new Map(),
			placeholders: new Set(),
			root: process.cwd(),
			runtime: new Map(),
			spriteDir: "_iconify",
			version: Date.now().toString(36),
		};
		store[key] = state;
		listenForWorkerIcons(state);
	}

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

export function registerIcon(state: State, pack: string, icon: string) {
	const icons = state.runtime.get(pack) ?? new Set<string>();
	state.runtime.set(pack, icons.add(icon));
}

/**
 * Pages rendered in worker threads (e.g. sveltekit's prerenderer) have their
 * own `globalThis`, so `getIcon` posts icons over a `BroadcastChannel` that
 * this listener adds to the registry
 */
function listenForWorkerIcons(state: State) {
	const channel = new BroadcastChannel(STATE_KEY);
	channel.addEventListener("message", (event) => {
		const [pack, icon] = (event as MessageEvent<unknown>).data as unknown[];
		if (typeof pack !== "string" || typeof icon !== "string") return;
		if (!NAME_REGEX.test(pack) || !NAME_REGEX.test(icon)) return;
		registerIcon(state, pack, icon);
	});
	// never keep the process alive just to listen
	(channel as BroadcastChannel & { unref?: () => void }).unref?.();
}
