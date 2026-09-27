import type { IndexHtmlTransformResult } from "vite";

import { PassThrough } from "node:stream";
import { describe, expect, it, vi } from "vitest";

import tailwindDebugScreens, { DEFAULT_SCREENS } from "./index";
import {
	buildLabelIcon,
	buildSpec,
	labelFor,
	parseCssLength,
	pickFontSize,
	readWidth,
	renderLabelSvg,
	type Snapshot,
} from "./internal";

const SCREENS = DEFAULT_SCREENS;
const DATA_URL_PREFIX = "data:image/svg+xml;utf8,";
const DATA_URL_REGEX = /^data:image\/svg\+xml;utf8,/;

function decodeIconUrl(url: string) {
	expect(url.startsWith(DATA_URL_PREFIX)).toBe(true);
	return decodeURIComponent(url.slice(DATA_URL_PREFIX.length));
}

describe("labelFor", () => {
	it("returns `<sm` below the smallest breakpoint", () => {
		expect(labelFor(SCREENS, 0)).toBe("<sm");
		expect(labelFor(SCREENS, 639)).toBe("<sm");
	});

	it("returns the matching breakpoint at the boundary", () => {
		expect(labelFor(SCREENS, 640)).toBe("sm");
		expect(labelFor(SCREENS, 768)).toBe("md");
		expect(labelFor(SCREENS, 1024)).toBe("lg");
		expect(labelFor(SCREENS, 1280)).toBe("xl");
		expect(labelFor(SCREENS, 1536)).toBe("2xl");
	});

	it("returns the highest matching breakpoint for very large widths", () => {
		expect(labelFor(SCREENS, 4000)).toBe("2xl");
	});

	it("works with a single-breakpoint config", () => {
		const single = [{ name: "mobile", value: "480px" }];
		expect(labelFor(single, 100)).toBe("<mobile");
		expect(labelFor(single, 480)).toBe("mobile");
	});

	it("returns `<` when the screens list is empty", () => {
		expect(labelFor([], 1000)).toBe("<");
	});
});

describe("parseCssLength", () => {
	it("parses px values", () => {
		expect(parseCssLength("640px")).toBe(640);
		expect(parseCssLength("  1024px  ")).toBe(1024);
	});

	it("treats rem as 16 * numeric", () => {
		expect(parseCssLength("40rem")).toBe(640);
		expect(parseCssLength("2.5rem")).toBe(40);
	});

	it("returns NaN for unknown or empty input", () => {
		expect(parseCssLength("nope")).toBeNaN();
		expect(parseCssLength("")).toBeNaN();
	});

	it("falls back to bare number when no unit is recognised", () => {
		// documented as best-effort - a bare number is treated as pixels
		expect(parseCssLength("500")).toBe(500);
	});
});

describe("pickFontSize", () => {
	it.each([
		[1, 15],
		[2, 15],
		[3, 11],
		[4, 9],
		[5, 8],
		[10, 8],
	])("returns %i for length %i", (length, size) => {
		expect(pickFontSize(length)).toBe(size);
	});
});

describe("readWidth", () => {
	it("returns the width from a valid JSON body", () => {
		expect(readWidth(JSON.stringify({ width: 1234 }))).toBe(1234);
	});

	it("returns undefined for empty, malformed, or unusable bodies", () => {
		expect(readWidth("")).toBeUndefined();
		expect(readWidth("not json")).toBeUndefined();
		expect(readWidth("null")).toBeUndefined();
		expect(readWidth("[]")).toBeUndefined();
		expect(readWidth(JSON.stringify({ height: 1234 }))).toBeUndefined();
		expect(readWidth(JSON.stringify({ width: "wide" }))).toBeUndefined();
		expect(
			readWidth(JSON.stringify({ width: Number.NaN })),
		).toBeUndefined();
	});
});

describe("renderLabelSvg", () => {
	it("returns a data:image/svg+xml url", () => {
		expect(renderLabelSvg("md", "#fff")).toMatch(DATA_URL_REGEX);
	});

	it("html-escapes the label to keep the svg well-formed", () => {
		const svg = decodeIconUrl(renderLabelSvg("<sm", "#000"));
		expect(svg).toContain(">&lt;sm<");
		expect(svg).not.toContain("<sm<");
	});

	it("embeds the fill color literally", () => {
		expect(decodeIconUrl(renderLabelSvg("md", "#deadbe"))).toContain(
			'fill="#deadbe"',
		);
	});

	it("adapts font size to label length", () => {
		expect(decodeIconUrl(renderLabelSvg("md", "#000"))).toContain(
			'font-size="15"',
		);
		expect(decodeIconUrl(renderLabelSvg("2xl", "#000"))).toContain(
			'font-size="11"',
		);
		expect(decodeIconUrl(renderLabelSvg("wide", "#000"))).toContain(
			'font-size="9"',
		);
	});
});

describe("buildLabelIcon", () => {
	it("returns a { light, dark } pair with the theme fills", () => {
		const icon = buildLabelIcon("md");
		expect(decodeURIComponent(icon.dark)).toContain('fill="#f3f4f6"');
		expect(decodeURIComponent(icon.light)).toContain('fill="#1f2937"');
	});
});

describe("buildSpec", () => {
	const snapshot: Snapshot = { active: "md", width: 900 };
	const spec = buildSpec(SCREENS, snapshot);

	it("uses column direction and lists elements in render order", () => {
		expect(spec.root).toBe("root");
		expect(spec.elements.root.props.direction).toBe("column");
		expect(spec.elements.root.children).toEqual([
			"activeLabel",
			"active",
			"meta",
			"screensLabel",
			"table",
		]);
	});

	it("puts the active label at the top with a heading variant", () => {
		expect(spec.elements.active.props.text).toBe("md");
		expect(spec.elements.active.props.variant).toBe("heading");
	});

	it("shows the current viewport width in px once known", () => {
		expect(spec.elements.meta.props.data).toEqual({ viewport: "900px" });
	});

	it("shows a `waiting` placeholder before the first width report", () => {
		const empty = buildSpec(SCREENS, { active: "<sm", width: 0 });
		expect(empty.elements.meta.props.data).toEqual({
			viewport: "(waiting for browser)",
		});
	});

	it("mirrors the configured screens into the table", () => {
		expect(spec.elements.table.props.data).toEqual({
			"2xl": "min-width: 1536px",
			"lg": "min-width: 1024px",
			"md": "min-width: 768px",
			"sm": "min-width: 640px",
			"xl": "min-width: 1280px",
		});
	});
});

describe("tailwindDebugScreens plugin", () => {
	it("carries the package name and only runs on `vite serve`", () => {
		const plugin = tailwindDebugScreens();
		expect(plugin.name).toBe(
			"@stephansama/vite-devtools-tailwind-debug-screens",
		);
		expect(plugin.apply).toBe("serve");
	});

	it("injects one inline module script that posts to /__vdtds/width", () => {
		const plugin = tailwindDebugScreens();
		const hook = plugin.transformIndexHtml as {
			handler: () => IndexHtmlTransformResult;
			order: "post";
		};
		expect(hook.order).toBe("post");
		const tags = hook.handler() as Array<{
			attrs: Record<string, string>;
			children: string;
			injectTo: string;
			tag: string;
		}>;
		expect(tags).toHaveLength(1);
		const [tag] = tags;
		expect(tag.tag).toBe("script");
		expect(tag.attrs).toEqual({ type: "module" });
		expect(tag.injectTo).toBe("body");
		expect(tag.children).toContain('fetch("/__vdtds/width"');
		expect(tag.children).toContain("window.innerWidth");
	});

	it("registers the dock in devtools.setup with a starting `<sm` icon", () => {
		const plugin = tailwindDebugScreens();
		const context = createFakeDevelopmentToolsContext();
		void plugin.devtools?.setup(context.ctx);

		expect(context.rendererCalls).toHaveLength(1);
		expect(context.dockRegisters).toHaveLength(1);
		const [entry] = context.dockRegisters;
		expect(entry.id).toBe("vite-devtools-tailwind-debug-screens");
		expect(entry.title).toBe("Tailwind Screens");
		expect(entry.type).toBe("json-render");
		expect(decodeURIComponent(entry.icon.dark)).toContain(">&lt;sm<");
	});
});

describe("dev-server middleware", () => {
	it("responds 405 to non-POST requests", async () => {
		const { middleware } = await mountPlugin();
		const { response } = await runMiddleware(middleware, {
			body: "",
			method: "GET",
		});
		expect(response.statusCode).toBe(405);
		expect(response.ended).toBe(true);
	});

	it("responds 204 to a valid POST and updates the dock", async () => {
		const { context, middleware, plugin } = await mountPlugin();
		void plugin.devtools?.setup(context.ctx);

		const { response } = await runMiddleware(middleware, {
			body: JSON.stringify({ width: 900 }),
			method: "POST",
		});
		expect(response.statusCode).toBe(204);

		// updateSpec called twice: once during setup, once after the POST
		expect(context.updateSpecCalls).toHaveLength(2);
		const [, updated] = context.updateSpecCalls;
		expect(updated.elements.active.props.text).toBe("md");
		expect(updated.elements.meta.props.data).toEqual({ viewport: "900px" });

		// icon swap on crossing the breakpoint
		expect(context.entryUpdates).toHaveLength(1);
		expect(decodeURIComponent(context.entryUpdates[0].icon.dark)).toContain(
			">md<",
		);
	});

	it("ignores malformed POST bodies but still responds 204", async () => {
		const { context, middleware, plugin } = await mountPlugin();
		void plugin.devtools?.setup(context.ctx);

		const { response } = await runMiddleware(middleware, {
			body: "not json",
			method: "POST",
		});
		expect(response.statusCode).toBe(204);
		expect(context.updateSpecCalls).toHaveLength(1); // only the setup call
		expect(context.entryUpdates).toHaveLength(0);
	});

	it("does not swap the icon when the breakpoint is unchanged", async () => {
		const { context, middleware, plugin } = await mountPlugin();
		void plugin.devtools?.setup(context.ctx);

		await runMiddleware(middleware, {
			body: JSON.stringify({ width: 900 }),
			method: "POST",
		});
		await runMiddleware(middleware, {
			body: JSON.stringify({ width: 950 }),
			method: "POST",
		});

		// two width reports produce two updateSpec calls (+1 from setup),
		// but only one icon swap since both fall in the `md` range
		expect(context.updateSpecCalls).toHaveLength(3);
		expect(context.entryUpdates).toHaveLength(1);
	});
});

// ---------- helpers ----------

interface FakeContext {
	ctx: Parameters<
		NonNullable<
			NonNullable<ReturnType<typeof tailwindDebugScreens>>["devtools"]
		>["setup"]
	>[0];
	dockRegisters: Array<{
		icon: { dark: string; light: string };
		id: string;
		title: string;
		type: string;
	}>;
	entryUpdates: Array<{ icon: { dark: string; light: string } }>;
	rendererCalls: Array<unknown>;
	updateSpecCalls: Array<ReturnType<typeof buildSpec>>;
}

interface FakeResponse {
	end: (chunk?: Buffer | string) => void;
	ended: boolean;
	setHeader: (name: string, value: string) => void;
	statusCode: number;
}

type MiddlewareFunction = (
	request: PassThrough & { method?: string },
	response: FakeResponse,
	next: () => void,
) => void;

async function captureMiddleware(
	plugin: ReturnType<typeof tailwindDebugScreens>,
) {
	let captured: MiddlewareFunction | undefined;
	const server = {
		middlewares: {
			use: (route: string, handler: MiddlewareFunction) => {
				expect(route).toBe("/__vdtds/width");
				captured = handler;
			},
		},
	};

	const hook = plugin.configureServer as
		| ((server: unknown) => Promise<void> | void)
		| undefined;
	await hook?.(server);
	if (!captured) throw new Error("middleware was never registered");
	return captured;
}

function createFakeDevelopmentToolsContext(): FakeContext {
	const rendererCalls: Array<unknown> = [];
	const updateSpecCalls: Array<ReturnType<typeof buildSpec>> = [];
	const dockRegisters: FakeContext["dockRegisters"] = [];
	const entryUpdates: FakeContext["entryUpdates"] = [];

	const context = {
		createJsonRenderer: (spec: ReturnType<typeof buildSpec>) => {
			rendererCalls.push(spec);
			updateSpecCalls.push(spec);
			return {
				updateSpec: (next: ReturnType<typeof buildSpec>) => {
					updateSpecCalls.push(next);
				},
				view: { stateKey: "test-key" },
			};
		},
		docks: {
			register: (entry: FakeContext["dockRegisters"][number]) => {
				dockRegisters.push(entry);
				return {
					update: (patch: {
						icon: { dark: string; light: string };
					}) => {
						entryUpdates.push(patch);
					},
				};
			},
		},
	} as unknown as FakeContext["ctx"];

	return {
		ctx: context,
		dockRegisters,
		entryUpdates,
		rendererCalls,
		updateSpecCalls,
	};
}

async function mountPlugin() {
	const plugin = tailwindDebugScreens();
	const middleware = await captureMiddleware(plugin);
	const context = createFakeDevelopmentToolsContext();
	return { context, middleware, plugin };
}

async function runMiddleware(
	middleware: MiddlewareFunction,
	options: { body: string; method: string },
) {
	const request = new PassThrough() as PassThrough & { method?: string };
	request.method = options.method;
	const response: FakeResponse = {
		end: vi.fn((_?: Buffer | string) => {
			response.ended = true;
		}),
		ended: false,
		setHeader: vi.fn(),
		statusCode: 200,
	};
	const next = vi.fn();

	middleware(request, response, next);

	if (options.method === "POST") {
		request.write(Buffer.from(options.body, "utf8"));
		request.end();
	}

	// let the "end" handler's async body run
	await new Promise((resolve) => setImmediate(resolve));
	return { next, request, response };
}
