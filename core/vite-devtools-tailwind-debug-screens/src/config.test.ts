import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	loadScreensFromConfigFile,
	parseCssBreakpoints,
	pickScreensFromJsConfig,
} from "./config";

let directory: string;

beforeEach(async () => {
	directory = await fs.mkdtemp(path.join(os.tmpdir(), "vdtds-config-"));
});

afterEach(async () => {
	vi.restoreAllMocks();
	await fs.rm(directory, { force: true, recursive: true });
});

describe("parseCssBreakpoints", () => {
	it("extracts every `--breakpoint-*` declaration", () => {
		const source = `
			@theme {
				--breakpoint-sm: 40rem;
				--breakpoint-md: 48rem;
				--breakpoint-lg: 64rem;
			}
		`;
		expect(parseCssBreakpoints(source)).toEqual([
			{ name: "sm", value: "40rem" },
			{ name: "md", value: "48rem" },
			{ name: "lg", value: "64rem" },
		]);
	});

	it("returns an empty list for css with no breakpoint declarations", () => {
		expect(parseCssBreakpoints("body { color: red; }")).toEqual([]);
	});

	it("survives repeated calls (regex lastIndex is reset)", () => {
		const source = `--breakpoint-md: 768px;`;
		expect(parseCssBreakpoints(source)).toEqual([
			{ name: "md", value: "768px" },
		]);
		expect(parseCssBreakpoints(source)).toEqual([
			{ name: "md", value: "768px" },
		]);
	});
});

describe("pickScreensFromJsConfig", () => {
	it("reads `theme.screens` in insertion order", () => {
		expect(
			pickScreensFromJsConfig({
				theme: {
					screens: { md: "768px", sm: "640px" },
				},
			}),
		).toEqual([
			{ name: "md", value: "768px" },
			{ name: "sm", value: "640px" },
		]);
	});

	it("merges `theme.extend.screens` on top of `theme.screens`", () => {
		expect(
			pickScreensFromJsConfig({
				theme: {
					extend: { screens: { xxl: "1920px" } },
					screens: { sm: "640px" },
				},
			}),
		).toEqual([
			{ name: "sm", value: "640px" },
			{ name: "xxl", value: "1920px" },
		]);
	});

	it("ignores non-string screen values (e.g. tailwind's `{ min, max }` shape)", () => {
		expect(
			pickScreensFromJsConfig({
				theme: {
					screens: {
						sm: "640px",
						tablet: { max: "1024px", min: "768px" },
					},
				},
			}),
		).toEqual([{ name: "sm", value: "640px" }]);
	});

	it("returns an empty list for a config missing `theme.screens`", () => {
		expect(pickScreensFromJsConfig({})).toEqual([]);
		expect(pickScreensFromJsConfig({ theme: {} })).toEqual([]);
		expect(pickScreensFromJsConfig("not an object")).toEqual([]);
	});
});

describe("loadScreensFromConfigFile", () => {
	it("loads and sorts screens from a css file", async () => {
		const file = path.join(directory, "app.css");
		await fs.writeFile(
			file,
			`
				@theme {
					--breakpoint-lg: 1024px;
					--breakpoint-sm: 640px;
					--breakpoint-md: 768px;
				}
			`,
		);
		const screens = await loadScreensFromConfigFile(file, directory);
		expect(screens).toEqual([
			{ name: "sm", value: "640px" },
			{ name: "md", value: "768px" },
			{ name: "lg", value: "1024px" },
		]);
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
		const screens = await loadScreensFromConfigFile(file, directory);
		expect(screens).toEqual([
			{ name: "sm", value: "40rem" },
			{ name: "md", value: "48rem" },
			{ name: "xl", value: "80rem" },
		]);
	});

	it("resolves a relative path against the passed root", async () => {
		const file = path.join(directory, "theme.css");
		await fs.writeFile(file, `--breakpoint-md: 768px;`);
		const screens = await loadScreensFromConfigFile("theme.css", directory);
		expect(screens).toEqual([{ name: "md", value: "768px" }]);
	});

	it("logs a warning and returns undefined for an unreadable file", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const result = await loadScreensFromConfigFile(
			"does-not-exist.css",
			directory,
		);
		expect(result).toBeUndefined();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0]?.[0]).toContain("failed to load config file");
	});

	it("logs a warning and returns undefined for an unsupported extension", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const file = path.join(directory, "config.yml");
		await fs.writeFile(file, "sm: 640px");
		const result = await loadScreensFromConfigFile(file, directory);
		expect(result).toBeUndefined();
		expect(warn.mock.calls[0]?.[0]).toContain(
			`unsupported config file extension ".yml"`,
		);
	});
});
