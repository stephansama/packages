import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RuleMap } from "@/rules";
import type { ConfigSchema } from "@/schema";

import { DEFAULT_IGNORE_LIST } from "@/paths";

const mocks = vi.hoisted(() => ({
	getPackages: vi.fn(),
	glob: vi.fn(),
	readFile: vi.fn(),
	up: vi.fn(),
}));

vi.mock("@manypkg/get-packages", () => ({ getPackages: mocks.getPackages }));
vi.mock("tinyglobby", () => ({ glob: mocks.glob }));
vi.mock("empathic/package", () => ({ up: mocks.up }));
vi.mock("node:fs", async (importOriginal) => {
	const original = await importOriginal<typeof import("node:fs")>();
	return {
		...original,
		promises: { ...original.promises, readFile: mocks.readFile },
	};
});

import { checkRules } from "./check";

type Config = Omit<ConfigSchema, "rules"> & { rules: RuleMap };

const makeConfig = (overrides: Partial<Config> = {}): Config =>
	({
		ignorePaths: [],
		ignoreRules: [],
		ruleDirectory: "rules",
		rules: {},
		...overrides,
	}) as Config;

const makeRule = (overrides: Record<string, unknown> = {}) => ({
	enabled: true,
	include: "**/*.json",
	name: "rule",
	parse: "json",
	when: vi.fn(() => {}),
	...overrides,
});

describe("checkRules", () => {
	beforeEach(() => {
		vi.spyOn(console, "info").mockImplementation(() => {});
		mocks.getPackages.mockResolvedValue({
			packages: [],
			rootDir: "/repo",
			rootPackage: { dir: "/repo", packageJson: { name: "root" } },
		});
		mocks.glob.mockResolvedValue([]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.clearAllMocks();
	});

	it("should throw when there is no root package", async () => {
		mocks.getPackages.mockResolvedValue({
			packages: [],
			rootDir: "/repo",
			rootPackage: undefined,
		});

		await expect(checkRules(makeConfig())).rejects.toThrow(
			"unable to find root package",
		);
	});

	it("should only glob for enabled rules and return [] with no matches", async () => {
		const config = makeConfig({
			rules: {
				off: makeRule({ enabled: false, name: "off" }),
				on: makeRule({ name: "on" }),
			} as unknown as RuleMap,
		});

		const result = await checkRules(config);

		expect(result).toEqual([]);
		expect(mocks.glob).toHaveBeenCalledTimes(1);
		expect(mocks.glob).toHaveBeenCalledWith("**/*.json", {
			cwd: process.cwd(),
			ignore: [...DEFAULT_IGNORE_LIST],
		});
	});

	it("should use config.ignorePaths instead of the default list", async () => {
		const config = makeConfig({
			ignorePaths: ["custom/**"],
			rules: { on: makeRule() } as unknown as RuleMap,
		});

		await checkRules(config);

		expect(mocks.glob).toHaveBeenCalledWith("**/*.json", {
			cwd: process.cwd(),
			ignore: ["custom/**"],
		});
	});

	it("should collect errors returned by a rule into dirty files", async () => {
		mocks.glob.mockResolvedValue(["pkg/a.json"]);
		mocks.readFile.mockResolvedValue('{"a":1}');
		const when = vi.fn(() => [{ id: "E", message: "bad" }]);
		const config = makeConfig({
			rules: { on: makeRule({ when }) } as unknown as RuleMap,
		});

		const result = await checkRules(config);

		expect(when).toHaveBeenCalledWith({ a: 1 }, expect.any(Object));
		expect(result).toHaveLength(1);
		expect(result[0].errors).toEqual([{ id: "E", message: "bad" }]);
		expect(result[0].rule).toBe("rule");
	});
});
