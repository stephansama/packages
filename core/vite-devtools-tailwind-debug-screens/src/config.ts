import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { Screens } from "./type";

import { parseCssLength } from "./internal";

const CSS_EXTENSIONS = new Set([".css"]);
const JS_EXTENSIONS = new Set([".cjs", ".cts", ".js", ".mjs", ".mts", ".ts"]);

/** Matches `--breakpoint-<name>: <value>;` declarations anywhere in a css file. */
const BREAKPOINT_DECL_REGEX = /--breakpoint-([\w-]+)\s*:([^;]*);/g;

/**
 * Load screens from a user-provided config file. Returns `undefined` (with a
 * warning logged) if the file can't be read or nothing looks like a screen
 * declaration; callers should fall back to defaults.
 */
export async function loadScreensFromConfigFile(
	configFile: string,
	root: string,
): Promise<Screens | undefined> {
	const absolute = path.isAbsolute(configFile)
		? configFile
		: path.resolve(root, configFile);
	const extension = path.extname(absolute).toLowerCase();

	try {
		if (CSS_EXTENSIONS.has(extension)) {
			const source = await fs.readFile(absolute, "utf8");
			const screens = parseCssBreakpoints(source);
			return sortAscending(screens);
		}
		if (JS_EXTENSIONS.has(extension)) {
			const module_ = (await import(pathToFileURL(absolute).href)) as {
				default?: unknown;
			};
			const screens = pickScreensFromJsConfig(module_.default);
			return sortAscending(screens);
		}
		warn(`unsupported config file extension "${extension}"`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		warn(`failed to load config file "${configFile}": ${message}`);
	}
	return undefined;
}

/** Extract every `--breakpoint-<name>: <value>` declaration from css source. */
export function parseCssBreakpoints(source: string): Screens {
	const screens: Screens = [];
	// state-carrying regex, needs a fresh `lastIndex` per call
	BREAKPOINT_DECL_REGEX.lastIndex = 0;
	let match: null | RegExpExecArray;
	while ((match = BREAKPOINT_DECL_REGEX.exec(source)) !== null) {
		const [, name, value] = match;
		if (!name || !value) continue;
		const trimmed = value.trim();
		if (trimmed) screens.push({ name, value: trimmed });
	}
	return screens;
}

/**
 * Read `theme.screens` (merged with `theme.extend.screens`) from a tailwind v3
 * style config object. Returns an empty array if nothing usable is found.
 */
export function pickScreensFromJsConfig(config: unknown): Screens {
	if (!isRecord(config)) return [];
	const theme = isRecord(config.theme) ? config.theme : undefined;
	if (!theme) return [];
	const extend = isRecord(theme.extend) ? theme.extend : undefined;
	const merged = {
		...(isRecord(theme.screens) ? theme.screens : {}),
		...(isRecord(extend?.screens) ? extend.screens : {}),
	};
	const screens: Screens = [];
	for (const [name, value] of Object.entries(merged)) {
		if (typeof value === "string" && value.trim()) {
			screens.push({ name, value: value.trim() });
		}
	}
	return screens;
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

function warn(message: string) {
	console.warn(
		`[@stephansama/vite-devtools-tailwind-debug-screens] ${message}`,
	);
}
