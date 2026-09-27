import type { Screens } from "./type";

export interface Snapshot {
	active: string;
	width: number;
}

/**
 * Build a `{ light, dark }` pair of data-url SVG icons showing the breakpoint
 * label. Font size shrinks with the label length so `<sm`, `md`, `2xl` all fit
 * inside the rail glyph. The DevTools host swaps the two urls based on its own
 * theme, so the icon tracks devtools dark/light mode.
 */
export function buildLabelIcon(label: string) {
	return {
		dark: renderLabelSvg(label, "#f3f4f6"),
		light: renderLabelSvg(label, "#1f2937"),
	};
}

export function buildSpec(screens: Screens, snapshot: Snapshot) {
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
export function labelFor(screens: Screens, width: number) {
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
export function parseCssLength(value: string) {
	const trimmed = value.trim();
	const numeric = Number.parseFloat(trimmed);
	if (Number.isNaN(numeric)) return Number.NaN;
	if (trimmed.endsWith("rem")) return numeric * 16;
	return numeric;
}

/** Step down the font size as the label gets longer so it always fits. */
export function pickFontSize(length: number) {
	if (length <= 2) return 15;
	if (length === 3) return 11;
	if (length === 4) return 9;
	return 8;
}

export function readWidth(body: string) {
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

export function renderLabelSvg(label: string, fill: string) {
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
