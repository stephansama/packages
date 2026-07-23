import pc from "picocolors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CliArguments } from "@/cli/arguments";

const mocks = vi.hoisted(() => ({ loadConfig: vi.fn() }));

vi.mock("@/config", () => ({ loadConfig: mocks.loadConfig }));

import { act, meta, properties, propertyToColor } from "./list";

describe("list command", () => {
	describe("propertyToColor", () => {
		it("should color the enabled flag by truthiness", () => {
			expect(propertyToColor("enabled", "true")).toBe(pc.green);
			expect(propertyToColor("enabled", "false")).toBe(pc.red);
		});

		it("should color include blue", () => {
			expect(propertyToColor("include", "x")).toBe(pc.blue);
		});

		it("should color each builtin parse format", () => {
			expect(propertyToColor("parse", "json")).toBe(pc.yellow);
			expect(propertyToColor("parse", "toml")).toBe(pc.green);
			expect(propertyToColor("parse", "yaml")).toBe(pc.red);
			expect(propertyToColor("parse", "txt")).toBe(pc.blue);
			expect(propertyToColor("parse", "unknown")).toBe(pc.red);
		});

		it("should return a wrapping function for a function parser", () => {
			const color = propertyToColor("parse", "function");
			expect(typeof color).toBe("function");
			expect(color("x")).toBe(pc.bgBlack(pc.red("x")));
		});

		it("should return an identity function for other properties", () => {
			const color = propertyToColor("exclude", "x");
			expect(color("x")).toBe("x");
		});
	});

	describe("properties", () => {
		it("should list the displayed rule properties", () => {
			expect(properties).toEqual([
				"enabled",
				"include",
				"exclude",
				"parse",
			]);
		});
	});

	describe("meta", () => {
		it("should be named list with an ls alias", () => {
			expect(meta.options.name).toBe("list");
			expect(meta.options.alias).toBe("ls");
		});
	});

	describe("act", () => {
		let info: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			info = vi.spyOn(console, "info").mockImplementation(() => {});
			mocks.loadConfig.mockResolvedValue({
				rules: {
					rule: {
						apply: () => {},
						enabled: true,
						include: "**/*",
						name: "rule",
						parse: "json",
						when: () => {},
					},
				},
			});
		});

		afterEach(() => {
			vi.restoreAllMocks();
			vi.clearAllMocks();
		});

		it("should print a colored listing", async () => {
			await act({ flags: { json: false } } as unknown as CliArguments);
			expect(mocks.loadConfig).toHaveBeenCalled();
			expect(info).toHaveBeenCalled();
		});

		it("should print json when the json flag is set", async () => {
			await act({ flags: { json: true } } as unknown as CliArguments);
			expect(info).toHaveBeenCalledWith(
				expect.stringContaining('"name": "rule"'),
			);
		});
	});
});
