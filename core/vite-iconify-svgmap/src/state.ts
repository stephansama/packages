import type { IconifyJSON } from "@iconify/types";

import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { type MessagePort, receiveMessageOnPort } from "node:worker_threads";

export const STATE_KEY = "@stephansama/vite-iconify-svgmap";

/** Valid iconify pack / icon names; also guards file paths built from them */
export const NAME_REGEX = /^[\w-]+$/;

export interface State {
	/** Public path prefix for render time sprites, e.g. `/_iconify/` */
	baseHref: string;
	/** Receives icons from `getIcon` calls in worker threads */
	channel?: BroadcastChannel;
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

/** Message posted by `getIcon` when it runs in a worker thread */
interface WorkerIconMessage {
	name: string;
	pack: string;
	type: "icon";
}

/**
 * Register every icon worker threads have posted so far.
 *
 * The channel listener registers icons as the event loop delivers them, which
 * can lag behind a worker's completion signal (e.g. sveltekit's prerender
 * result). `BroadcastChannel` messages are queued at every receiver as soon as
 * they are posted, so draining the queue synchronously picks up whatever the
 * listener has not seen yet, without any timing guess.
 */
export function drainWorkerIcons() {
	const state = getState();
	if (!state.channel) return;

	// node accepts a BroadcastChannel here; the types only declare MessagePort
	const port = state.channel as unknown as MessagePort;
	for (
		let entry = receiveMessageOnPort(port);
		entry;
		entry = receiveMessageOnPort(port)
	) {
		registerWorkerIcon(state, entry.message);
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
		state.channel = listenForWorkerIcons(state);
	}

	return store[key];
}

export function loadCollection(pack: string) {
	const state = getState();
	// a trailing slash makes node resolution start inside `root`
	const cwd = state.root.endsWith("/") ? state.root : `${state.root}/`;
	const key = `${cwd}\0${pack}`;
	let collection = state.collections.get(key);

	if (!collection) {
		collection = loadCollectionFromFS(pack, false, "@iconify-json", cwd);
		state.collections.set(key, collection);
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
	if (typeof BroadcastChannel !== "function") return;

	const channel = new BroadcastChannel(STATE_KEY);
	channel.addEventListener("message", (event) => {
		registerWorkerIcon(state, (event as MessageEvent<unknown>).data);
	});
	// never keep the process alive just to listen
	(channel as BroadcastChannel & { unref?: () => void }).unref?.();

	return channel;
}

function registerWorkerIcon(state: State, data: unknown) {
	const message = data as Partial<WorkerIconMessage> | undefined;
	if (message?.type !== "icon") return;

	const { name, pack } = message;
	if (typeof pack !== "string" || typeof name !== "string") return;
	if (!NAME_REGEX.test(pack) || !NAME_REGEX.test(name)) return;
	registerIcon(state, pack, name);
}
