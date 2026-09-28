import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	loadScreensFromConfigFile,
	parseCssBreakpoints,
	pickScreensFromJsConfig,
} from "./config";
import { DEFAULT_SCREENS } from "./index";

const DEFAULTS = DEFAULT_SCREENS;

let directory: string;

beforeEach(async () => {
	directory = await fs.mkdtemp(path.join(os.tmpdir(), "vdtds-config-"));
});

afterEach(async () => {
	vi.restoreAllMocks();
	await fs.rm(directory, { force: true, recursive: true });
});

describe("parseCssBreakpoints", () => {
	it("layers `--breakpoint-*` declarations on top of the defaults", () => {
		const source = `
			@theme {
				--breakpoint-3xl: 120rem;
			}
		`;
		const result = parseCssBreakpoints(source, DEFAULTS);
		expect(result).toEqual([...DEFAULTS, { name: "3xl", value: "120rem" }]);
	});

	it("overrides an existing default when the same name is redeclared", () => {
		const result = parseCssBreakpoints(`--breakpoint-md: 900px;`, DEFAULTS);
		expect(result.find((s) => s.name === "md")).toEqual({
			name: "md",
			value: "900px",
		});
		expect(result).toHaveLength(DEFAULTS.length);
	});

	it("treats `--breakpoint-<name>: initial` as removing that name", () => {
		const result = parseCssBreakpoints(
			`--breakpoint-lg: initial;`,
			DEFAULTS,
		);
		expect(result.find((s) => s.name === "lg")).toBeUndefined();
		expect(result).toHaveLength(DEFAULTS.length - 1);
	});

	it("clears every breakpoint on `--breakpoint-*: initial`", () => {
		const result = parseCssBreakpoints(
			`@theme { --breakpoint-*: initial; --breakpoint-tablet: 40rem; }`,
			DEFAULTS,
		);
		expect(result).toEqual([{ name: "tablet", value: "40rem" }]);
	});

	it("clears every breakpoint on the global `--*: initial` reset", () => {
		const result = parseCssBreakpoints(
			`@theme { --*: initial; --breakpoint-tablet: 40rem; }`,
			DEFAULTS,
		);
		expect(result).toEqual([{ name: "tablet", value: "40rem" }]);
	});

	it("applies the `*` reset in source order", () => {
		const result = parseCssBreakpoints(
			`--breakpoint-tablet: 40rem; --breakpoint-*: initial; --breakpoint-desktop: 80rem;`,
			DEFAULTS,
		);
		expect(result).toEqual([{ name: "desktop", value: "80rem" }]);
	});

	it("returns the defaults unchanged for css with no breakpoint declarations", () => {
		expect(parseCssBreakpoints("body { color: red; }", DEFAULTS)).toEqual(
			DEFAULTS,
		);
	});

	it("survives repeated calls (regex lastIndex is reset)", () => {
		const source = `--breakpoint-md: 999px;`;
		const first = parseCssBreakpoints(source, DEFAULTS);
		const second = parseCssBreakpoints(source, DEFAULTS);
		expect(first).toEqual(second);
	});
});

describe("pickScreensFromJsConfig", () => {
	it("replaces defaults when `theme.screens` is set", () => {
		expect(
			pickScreensFromJsConfig(
				{ theme: { screens: { md: "768px", sm: "640px" } } },
				DEFAULTS,
			),
		).toEqual([
			{ name: "md", value: "768px" },
			{ name: "sm", value: "640px" },
		]);
	});

	it("extends defaults when only `theme.extend.screens` is set", () => {
		const result = pickScreensFromJsConfig(
			{ theme: { extend: { screens: { "3xl": "1920px" } } } },
			DEFAULTS,
		);
		expect(result).toEqual([...DEFAULTS, { name: "3xl", value: "1920px" }]);
	});

	it("layers `theme.extend.screens` on top of `theme.screens`", () => {
		expect(
			pickScreensFromJsConfig(
				{
					theme: {
						extend: { screens: { xxl: "1920px" } },
						screens: { sm: "640px" },
					},
				},
				DEFAULTS,
			),
		).toEqual([
			{ name: "sm", value: "640px" },
			{ name: "xxl", value: "1920px" },
		]);
	});

	it("ignores non-string screen values (e.g. tailwind's `{ min, max }` shape)", () => {
		expect(
			pickScreensFromJsConfig(
				{
					theme: {
						screens: {
							sm: "640px",
							tablet: { max: "1024px", min: "768px" },
						},
					},
				},
				DEFAULTS,
			),
		).toEqual([{ name: "sm", value: "640px" }]);
	});

	it("returns the defaults when the config has no `theme` at all", () => {
		expect(pickScreensFromJsConfig({ content: [] }, DEFAULTS)).toEqual(
			DEFAULTS,
		);
	});

	it("returns an empty list when the config is not an object", () => {
		expect(pickScreensFromJsConfig("not an object", DEFAULTS)).toEqual([]);
	});

	it("returns the defaults when `theme` is set but overrides no screens", () => {
		expect(pickScreensFromJsConfig({ theme: {} }, DEFAULTS)).toEqual(
			DEFAULTS,
		);
	});

	it("returns an empty list when `theme.screens` is explicitly emptied", () => {
		expect(
			pickScreensFromJsConfig({ theme: { screens: {} } }, DEFAULTS),
		).toEqual([]);
	});
});

describe("loadScreensFromConfigFile", () => {
	it("loads and sorts screens from a css file (layered on defaults)", async () => {
		const file = path.join(directory, "app.css");
		await fs.writeFile(
			file,
			`
				@theme {
					--breakpoint-3xl: 1920px;
				}
			`,
		);
		const screens = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(screens?.at(-1)).toEqual({ name: "3xl", value: "1920px" });
		expect(screens).toHaveLength(DEFAULTS.length + 1);
	});

	it("loads and sorts screens from a `.mjs` tailwind config", async () => {
		const file = path.join(directory, "tailwind.config.mjs");
		await fs.writeFile(
			file,
			`export default {
				theme: {
					screens: {
						md: "48rem",
						sm: "40rem",
						xl: "80rem",
					},
				},
			};`,
		);
		const screens = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(screens).toEqual([
			{ name: "sm", value: "40rem" },
			{ name: "md", value: "48rem" },
			{ name: "xl", value: "80rem" },
		]);
	});

	it("resolves a relative path against the passed root", async () => {
		const file = path.join(directory, "theme.css");
		await fs.writeFile(file, `--breakpoint-md: 900px;`);
		const screens = await loadScreensFromConfigFile(
			"theme.css",
			directory,
			DEFAULTS,
		);
		expect(screens?.find((s) => s.name === "md")).toEqual({
			name: "md",
			value: "900px",
		});
	});

	it("logs a warning and returns undefined for an unreadable file", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const result = await loadScreensFromConfigFile(
			"does-not-exist.css",
			directory,
			DEFAULTS,
		);
		expect(result).toBeUndefined();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0]?.[0]).toContain("failed to load config file");
	});

	it("logs a warning and returns undefined for an unsupported extension", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const file = path.join(directory, "config.yml");
		await fs.writeFile(file, "sm: 640px");
		const result = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(result).toBeUndefined();
		expect(warn.mock.calls[0]?.[0]).toContain(
			`unsupported config file extension ".yml"`,
		);
	});

	it("logs a warning and returns undefined when a js config explicitly zeroes out screens", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const file = path.join(directory, "empty-screens.mjs");
		await fs.writeFile(file, `export default { theme: { screens: {} } };`);
		const result = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(result).toBeUndefined();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0]?.[0]).toContain("resolved to no breakpoints");
	});

	it("re-reads a js config after it's edited (cache-busted)", async () => {
		const file = path.join(directory, "tailwind.config.mjs");
		await fs.writeFile(
			file,
			`export default { theme: { screens: { sm: "640px" } } };`,
		);
		const first = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(first).toEqual([{ name: "sm", value: "640px" }]);

		// force a distinct mtime so the cache-buster URL changes
		await new Promise((resolve) => setTimeout(resolve, 20));
		await fs.writeFile(
			file,
			`export default { theme: { screens: { lg: "1024px" } } };`,
		);
		const second = await loadScreensFromConfigFile(
			file,
			directory,
			DEFAULTS,
		);
		expect(second).toEqual([{ name: "lg", value: "1024px" }]);
	});
});
