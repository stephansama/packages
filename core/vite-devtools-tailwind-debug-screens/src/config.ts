import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { Screens } from "./type";

import { parseCssLength } from "./internal";

const CSS_EXTENSIONS = new Set([".css"]);
const JS_EXTENSIONS = new Set([".cjs", ".cts", ".js", ".mjs", ".mts", ".ts"]);

/**
 * Matches `--breakpoint-<name>: <value>;` declarations anywhere in a css file,
 * plus the global `--*: <value>;` theme reset (captured with no name).
 */
const BREAKPOINT_DECL_REGEX = /--(?:breakpoint-([\w-]+|\*)|\*)\s*:([^;]*);/g;

/**
 * Load screens from a user-provided config file. Returns `undefined` (with a
 * warning logged) if the file can't be read or resolves to no screen
 * declarations; callers should fall back to defaults.
 *
 * `defaults` seeds the base tailwind screens so `extend`-style JS configs and
 * v4 css files that only add / override a single breakpoint don't accidentally
 * throw away the built-ins.
 */
export async function loadScreensFromConfigFile(
	configFile: string,
	root: string,
	defaults: Screens,
): Promise<Screens | undefined> {
	const absolute = path.isAbsolute(configFile)
		? configFile
		: path.resolve(root, configFile);
	const extension = path.extname(absolute).toLowerCase();

	try {
		if (CSS_EXTENSIONS.has(extension)) {
			const source = await fs.readFile(absolute, "utf8");
			return finalise(parseCssBreakpoints(source, defaults), configFile);
		}
		if (JS_EXTENSIONS.has(extension)) {
			// bust node's module cache so config edits pick up on a `r`estart
			// inside the same process; `?t=<mtime>` keeps hits cheap while the
			// file is unchanged
			const stats = await fs.stat(absolute);
			const url = pathToFileURL(absolute).href + `?t=${stats.mtimeMs}`;
			const module_ = (await import(url)) as { default?: unknown };
			return finalise(
				pickScreensFromJsConfig(module_.default, defaults),
				configFile,
			);
		}
		warn(`unsupported config file extension "${extension}"`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		warn(`failed to load config file "${configFile}": ${message}`);
	}
	return undefined;
}

/**
 * Fold every `--breakpoint-<name>: <value>` declaration from a css file over
 * the defaults, honouring tailwind v4's reset semantics in source order: `--*:
 * initial` / `--breakpoint-*: initial` clear every breakpoint declared so far
 * (defaults included) and `--breakpoint-<name>: initial` removes just that
 * name.
 */
export function parseCssBreakpoints(
	source: string,
	defaults: Screens,
): Screens {
	const map = toMap(defaults);
	// state-carrying regex, needs a fresh `lastIndex` per call
	BREAKPOINT_DECL_REGEX.lastIndex = 0;
	let match: null | RegExpExecArray;
	while ((match = BREAKPOINT_DECL_REGEX.exec(source)) !== null) {
		// no captured name means the global `--*` reset, same as `--breakpoint-*`
		const [, name = "*", rawValue] = match;
		const trimmed = rawValue?.trim() ?? "";
		if (!trimmed) continue;
		if (trimmed === "initial") {
			if (name === "*") map.clear();
			else map.delete(name);
			continue;
		}
		if (name === "*") continue;
		map.set(name, trimmed);
	}
	return toScreens(map);
}

/**
 * Compute the effective `theme.screens` for a tailwind v3-style js config,
 * matching tailwind's own semantics: `theme.screens` REPLACES the defaults,
 * while `theme.extend.screens` ADDS to whichever base is in effect.
 */
export function pickScreensFromJsConfig(
	config: unknown,
	defaults: Screens,
): Screens {
	if (!isRecord(config)) return [];
	// tailwind treats a missing `theme` like `theme: {}` (defaults apply)
	const theme = isRecord(config.theme) ? config.theme : {};

	const base = isRecord(theme.screens)
		? filterStringEntries(theme.screens)
		: toMap(defaults);
	const extend = isRecord(theme.extend) ? theme.extend : undefined;
	const extensions = isRecord(extend?.screens)
		? filterStringEntries(extend.screens)
		: new Map<string, string>();
	for (const [name, value] of extensions) base.set(name, value);
	return toScreens(base);
}

function filterStringEntries(
	record: Record<string, unknown>,
): Map<string, string> {
	const map = new Map<string, string>();
	for (const [name, value] of Object.entries(record)) {
		if (typeof value === "string" && value.trim()) {
			map.set(name, value.trim());
		}
	}
	return map;
}

/** Sort ascending, log a warning + return undefined if nothing was resolved. */
function finalise(screens: Screens, configFile: string) {
	if (screens.length === 0) {
		warn(
			`config file "${configFile}" resolved to no breakpoints; falling back to defaults`,
		);
		return;
	}
	return sortAscending(screens);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Sort ascending by parsed pixel width; screens with unparseable values sink. */
function sortAscending(screens: Screens): Screens {
	return screens.toSorted((a, b) => {
		const numericA = parseCssLength(a.value);
		const numericB = parseCssLength(b.value);
		if (Number.isNaN(numericA)) return 1;
		if (Number.isNaN(numericB)) return -1;
		return numericA - numericB;
	});
}

function toMap(screens: Screens): Map<string, string> {
	return new Map(screens.map((screen) => [screen.name, screen.value]));
}

function toScreens(map: Map<string, string>): Screens {
	return Array.from(map, ([name, value]) => ({ name, value }));
}

function warn(message: string) {
	console.warn(
		`[@stephansama/vite-devtools-tailwind-debug-screens] ${message}`,
	);
}
