import type { IconifyJSON } from "@iconify/types";

import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

export const STATE_KEY = "@stephansama/vite-iconify-svgmap";

/** Valid iconify pack / icon names; also guards file paths built from them */
export const NAME_REGEX = /^[\w-]+$/;

export interface State {
	/** Public path prefix for render time sprites, e.g. `/_iconify/` */
	baseHref: string;
	/** Receives icons from `getIcon` calls in worker threads */
	bridge?: WorkerBridge;
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

/**
 * Messages exchanged with `getIcon` running in worker threads:
 *
 * - `icon`: a worker rendered an icon
 * - `flush`: the main thread asks every worker to confirm what it sent
 * - `flushed`: a worker's reply. messages from one sender arrive in order, so
 *   every `icon` that worker posted has been received once this arrives
 */
type WorkerMessage =
	| { name: string; pack: string; sender: string; type: "icon" }
	| { sender: string; token: string; type: "flushed" }
	| { token: string; type: "flush" };

/** How long to wait for workers whose icons have not arrived yet */
const DISCOVERY_WINDOW = 50;
/** How long to wait for known workers before warning */
const FLUSH_TIMEOUT = 2000;

interface WorkerBridge {
	channel: BroadcastChannel;
	/** Workers that posted at least one icon */
	senders: Set<string>;
	/** Pending `flushWorkerIcons` calls waiting for replies */
	waiters: Set<(message: WorkerMessage) => void>;
}

/**
 * Wait until every worker thread that registered icons has confirmed that all
 * of its icons were received.
 *
 * Workers already known must answer (or time out). Workers whose first icon is
 * still in flight are not known yet, so the request is always sent and any
 * worker answering within {@link DISCOVERY_WINDOW} is waited for as well.
 */
export async function flushWorkerIcons() {
	const { bridge } = getState();
	if (!bridge) return;

	// let messages that are already queued land first
	await new Promise((resolve) => setImmediate(resolve));
	const pending = new Set(bridge.senders);
	const answered = new Set<string>();
	const token = Math.random().toString(36).slice(2);

	await new Promise<void>((resolve) => {
		let discovering = true;

		const finish = () => {
			clearTimeout(discovery);
			clearTimeout(timeout);
			bridge.waiters.delete(onMessage);
			resolve();
		};

		const discovery = setTimeout(() => {
			discovering = false;
			if (pending.size === 0) finish();
		}, DISCOVERY_WINDOW);

		const timeout = setTimeout(() => {
			console.warn(
				`[${STATE_KEY}] ${pending.size} worker thread(s) did not confirm their icons; sprites may be missing icons rendered there`,
			);
			finish();
		}, FLUSH_TIMEOUT);

		function onMessage(message: WorkerMessage) {
			if (message.type !== "flushed" || message.token !== token) return;
			answered.add(message.sender);
			pending.delete(message.sender);
			if (!discovering && pending.size === 0) finish();
		}

		bridge.waiters.add(onMessage);
		bridge.channel.postMessage({
			token,
			type: "flush",
		} satisfies WorkerMessage);
	});

	// accounted for (or gone); a worker that posts again is added back
	for (const sender of [...bridge.senders, ...answered]) {
		bridge.senders.delete(sender);
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
		state.bridge = listenForWorkerIcons(state);
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
function listenForWorkerIcons(state: State): undefined | WorkerBridge {
	if (typeof BroadcastChannel !== "function") return;

	const channel = new BroadcastChannel(STATE_KEY);
	const bridge: WorkerBridge = {
		channel,
		senders: new Set(),
		waiters: new Set(),
	};

	channel.addEventListener("message", (event) => {
		const message = (event as MessageEvent<Partial<WorkerMessage>>).data;
		if (message?.type === "flushed") {
			for (const waiter of bridge.waiters) {
				waiter(message as WorkerMessage);
			}
			return;
		}
		if (message?.type !== "icon") return;

		const { name, pack, sender } = message;
		if (typeof pack !== "string" || typeof name !== "string") return;
		if (!NAME_REGEX.test(pack) || !NAME_REGEX.test(name)) return;
		if (typeof sender === "string") bridge.senders.add(sender);
		registerIcon(state, pack, name);
	});
	// never keep the process alive just to listen
	(channel as BroadcastChannel & { unref?: () => void }).unref?.();

	return bridge;
}
