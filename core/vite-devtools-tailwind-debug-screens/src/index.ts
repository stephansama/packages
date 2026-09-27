/// <reference types="@vitejs/devtools-kit" />
import type { Plugin } from "vite";

import type { Options, Screens } from "./type";

import pkg from "../package.json";
import { CLIENT_SOURCE, REPORT_PATH } from "./client";

export type { Options, Screens } from "./type";

const DOCK_ID = "vite-devtools-tailwind-debug-screens";

/** Tailwind css's default `screens` config, in ascending order. */
export const DEFAULT_SCREENS: Screens = [
	{ name: "sm", value: "640px" },
	{ name: "md", value: "768px" },
	{ name: "lg", value: "1024px" },
	{ name: "xl", value: "1280px" },
	{ name: "2xl", value: "1536px" },
];

interface Snapshot {
	active: string;
	width: number;
}

/**
 * Vite devtool that surfaces the active tailwind breakpoint inside the
 * `@vitejs/devtools` dock - no floating badge, no overlay. Open the `Tailwind
 * Screens` dock to see the current viewport width, the active breakpoint, and
 * the configured screens.
 */
export default function tailwindDebugScreens(options: Options = {}): Plugin {
	const screens = options.screens ?? DEFAULT_SCREENS;
	let latest: Snapshot = { active: labelFor(screens, 0), width: 0 };
	let apply: ((snapshot: Snapshot) => void) | undefined;
	let currentIconLabel: string | undefined;

	return {
		apply: "serve",

		configureServer(server) {
			server.middlewares.use(REPORT_PATH, (request, response) => {
				if (request.method !== "POST") {
					response.statusCode = 405;
					response.end();
					return;
				}
				const chunks: Buffer[] = [];
				request.on("data", (chunk: Buffer) => chunks.push(chunk));
				request.on("end", () => {
					const width = readWidth(
						Buffer.concat(chunks).toString("utf8"),
					);
					if (width !== undefined) {
						latest = { active: labelFor(screens, width), width };
						apply?.(latest);
					}
					response.statusCode = 204;
					response.end();
				});
			});
		},

		devtools: {
			setup(context) {
				const ui = context.createJsonRenderer(
					buildSpec(screens, latest),
				);
				currentIconLabel = latest.active;
				const entry = context.docks.register({
					icon: buildLabelIcon(currentIconLabel),
					id: DOCK_ID,
					title: "Tailwind Screens",
					type: "json-render",
					view: ui.view,
				});
				apply = (snapshot) => {
					void ui.updateSpec(buildSpec(screens, snapshot));
					if (snapshot.active !== currentIconLabel) {
						currentIconLabel = snapshot.active;
						entry.update({
							icon: buildLabelIcon(currentIconLabel),
						});
					}
				};
			},
		},

		name: pkg.name,

		transformIndexHtml: {
			handler: () => [
				{
					attrs: { type: "module" },
					children: CLIENT_SOURCE,
					injectTo: "body",
					tag: "script",
				},
			],
			order: "post",
		},
	};
}

/**
 * Build a `{ light, dark }` pair of data-url SVG icons showing the breakpoint
 * label. Font size shrinks with the label length so `<sm`, `md`, `2xl` all fit
 * inside the rail glyph. The DevTools host swaps the two urls based on its own
 * theme, so the icon tracks devtools dark/light mode.
 */
function buildLabelIcon(label: string) {
	return {
		dark: renderLabelSvg(label, "#f3f4f6"),
		light: renderLabelSvg(label, "#1f2937"),
	};
}

function buildSpec(screens: Screens, snapshot: Snapshot) {
	const screensData: Record<string, string> = {};
	for (const screen of screens) {
		screensData[screen.name] = `min-width: ${screen.value}`;
	}
	const viewport =
		snapshot.width > 0 ? `${snapshot.width}px` : "(waiting for browser)";

	return {
		elements: {
			active: {
				props: { text: snapshot.active, variant: "heading" },
				type: "Text",
			},
			activeLabel: {
				props: { color: "muted", text: "Active", variant: "caption" },
				type: "Text",
			},
			meta: {
				props: { data: { viewport } },
				type: "KeyValueTable",
			},
			root: {
				children: [
					"activeLabel",
					"active",
					"meta",
					"screensLabel",
					"table",
				],
				props: { direction: "column", gap: 12 },
				type: "Stack",
			},
			screensLabel: {
				props: {
					color: "muted",
					text: "Configured screens",
					variant: "caption",
				},
				type: "Text",
			},
			table: {
				props: { data: screensData },
				type: "KeyValueTable",
			},
		},
		root: "root",
	};
}

/** Find the active breakpoint for a given viewport width. */
function labelFor(screens: Screens, width: number) {
	let active = `<${screens[0]?.name ?? ""}`;
	for (const screen of screens) {
		if (width >= parseCssLength(screen.value)) active = screen.name;
	}
	return active;
}

/**
 * Best-effort css length parsing: supports `px` and `rem` since those cover
 * every tailwind default and the vast majority of custom screens. Anything
 * unrecognised falls back to `NaN` so the breakpoint is treated as inactive.
 */
function parseCssLength(value: string) {
	const trimmed = value.trim();
	const numeric = Number.parseFloat(trimmed);
	if (Number.isNaN(numeric)) return Number.NaN;
	if (trimmed.endsWith("rem")) return numeric * 16;
	return numeric;
}

/** Step down the font size as the label gets longer so it always fits. */
function pickFontSize(length: number) {
	if (length <= 2) return 15;
	if (length === 3) return 11;
	if (length === 4) return 9;
	return 8;
}

function readWidth(body: string) {
	if (!body) return;
	let parsed: unknown;
	try {
		parsed = JSON.parse(body);
	} catch {
		return;
	}
	if (typeof parsed !== "object" || parsed === null) return;
	const width = (parsed as { width?: unknown }).width;
	return typeof width === "number" && Number.isFinite(width)
		? width
		: undefined;
}

function renderLabelSvg(label: string, fill: string) {
	const escaped = label
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
	const size = pickFontSize(label.length);
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
		`<text x="12" y="12" text-anchor="middle" dominant-baseline="central" ` +
		`font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ` +
		`font-weight="700" font-size="${size}" fill="${fill}">${escaped}</text>` +
		`</svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
