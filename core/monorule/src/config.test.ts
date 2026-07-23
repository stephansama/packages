import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CliArguments } from "@/cli/arguments";
import type { Rule } from "@/rules";

const mocks = vi.hoisted(() => ({
	cosmiconfig: vi.fn(),
	getDefaultSearchPlaces: vi.fn(() => [] as string[]),
	loadRules: vi.fn(() => Promise.resolve([] as Rule[])),
	search: vi.fn(),
}));

vi.mock("cosmiconfig", () => ({
	cosmiconfig: mocks.cosmiconfig,
	getDefaultSearchPlaces: mocks.getDefaultSearchPlaces,
}));

vi.mock("@/rules/load", () => ({ loadRules: mocks.loadRules }));

import { loadConfig, loadToml, validateRules } from "./config";

const makeArguments = (flags: Record<string, unknown>) =>
	({ flags }) as unknown as CliArguments;

describe("config", () => {
	beforeEach(() => {
		mocks.cosmiconfig.mockReturnValue({ search: mocks.search });
		mocks.search.mockReset();
		mocks.loadRules.mockResolvedValue([]);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("validateRules", () => {
		it("should map unique rule names to rules", () => {
			const ruleA = { name: "a" } as unknown as Rule;
			const ruleB = { name: "b" } as unknown as Rule;
			expect(validateRules(ruleA, ruleB)).toEqual({ a: ruleA, b: ruleB });
		});

		it("should throw on a duplicate rule name", () => {
			const ruleA = { name: "dup" } as unknown as Rule;
			const ruleB = { name: "dup" } as unknown as Rule;
			expect(() => validateRules(ruleA, ruleB)).toThrow(
				"found a rule with a duplicate name dup",
			);
		});
	});

	describe("loadToml", () => {
		it("should parse valid toml", () => {
			expect(loadToml("f.toml", "a = 1")).toEqual({ a: 1 });
		});

		it("should throw on invalid toml", () => {
			expect(() => loadToml("f.toml", "a = =")).toThrow();
		});
	});

	describe("loadConfig", () => {
		it("should return defaults when no config file is found", async () => {
			const result = await loadConfig(makeArguments({ config: "" }));
			expect(mocks.cosmiconfig).toHaveBeenCalledWith(
				"/monorule",
				expect.any(Object),
			);
			expect(result).toEqual({
				ignorePaths: [],
				ignoreRules: [],
				ruleDirectory: "rules",
				rules: {},
			});
		});

		it("should merge a found config file and pass it to loadRules", async () => {
			mocks.search.mockResolvedValue({
				config: { ruleDirectory: "custom" },
				filepath: "/repo/.monorulerc.toml",
			});

			const result = await loadConfig(makeArguments({ config: "" }));

			expect(result.ruleDirectory).toBe("custom");
			expect(mocks.loadRules).toHaveBeenCalledWith(
				expect.objectContaining({ ruleDirectory: "custom" }),
				"/repo/.monorulerc.toml",
			);
		});

		it("should prepend the --config flag to the search places", async () => {
			await loadConfig(makeArguments({ config: "my.config.ts" }));

			const [, options] = mocks.cosmiconfig.mock.calls.at(-1) as [
				string,
				{ searchPlaces: string[] },
			];
			expect(options.searchPlaces[0]).toBe("my.config.ts");
		});

		it("should override config values with truthy cli flags", async () => {
			const result = await loadConfig(
				makeArguments({ config: "", ruleDirectory: "from-cli" }),
			);
			expect(result.ruleDirectory).toBe("from-cli");
		});
	});
});
