import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RuleMap } from "@/rules";
import type { DirtyFile, Error } from "@/type";

const mocks = vi.hoisted(() => ({ stringify: vi.fn(), writeFile: vi.fn() }));

vi.mock("node:fs", async (importOriginal) => {
	const original = await importOriginal<typeof import("node:fs")>();
	return {
		...original,
		promises: { ...original.promises, writeFile: mocks.writeFile },
	};
});

vi.mock("@/parse", () => ({ stringify: mocks.stringify }));

import { applyRules } from "./apply";

type TestFile = DirtyFile & { errors: Array<Error> };

const makeFile = (overrides: Partial<TestFile> = {}): TestFile =>
	({
		absolutePath: "/repo/file.json",
		content: {},
		errors: [],
		relativePath: "file.json",
		rule: "rule",
		...overrides,
	}) as TestFile;

describe("applyRules", () => {
	beforeEach(() => {
		mocks.stringify.mockReturnValue("{}");
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should apply, stringify and write a builtin-parse rule", async () => {
		mocks.stringify.mockReturnValue('{"a":1}');
		const rule = {
			apply: vi.fn(() => ({ a: 1 })),
			name: "rule",
			parse: "json",
		};

		await applyRules([makeFile()], { rule } as unknown as RuleMap);

		expect(rule.apply).toHaveBeenCalled();
		expect(mocks.stringify).toHaveBeenCalledWith({ a: 1 }, "json");
		expect(mocks.writeFile).toHaveBeenCalledWith(
			"/repo/file.json",
			'{"a":1}',
			"utf8",
		);
	});

	it("should skip rules without an apply function", async () => {
		const rule = { name: "rule", parse: "json" };
		await applyRules([makeFile()], { rule } as unknown as RuleMap);
		expect(mocks.writeFile).not.toHaveBeenCalled();
	});

	it("should skip when apply resolves to a falsy value", async () => {
		const rule = {
			apply: vi.fn(() => {}),
			name: "rule",
			parse: "json",
		};
		await applyRules([makeFile()], { rule } as unknown as RuleMap);
		expect(mocks.writeFile).not.toHaveBeenCalled();
	});

	it("should prefer a rule-provided stringify over the builtin", async () => {
		const rule = {
			apply: vi.fn(() => ({ a: 1 })),
			name: "rule",
			parse: "json",
			stringify: vi.fn(() => "custom"),
		};

		await applyRules([makeFile()], { rule } as unknown as RuleMap);

		expect(rule.stringify).toHaveBeenCalledWith({ a: 1 });
		expect(mocks.stringify).not.toHaveBeenCalled();
		expect(mocks.writeFile).toHaveBeenCalledWith(
			"/repo/file.json",
			"custom",
			"utf8",
		);
	});

	it("should fall back to json format when parse is a function", async () => {
		mocks.stringify.mockReturnValue("out");
		const rule = {
			apply: vi.fn(() => ({ a: 1 })),
			name: "rule",
			parse: (input: string) => input,
		};

		await applyRules([makeFile()], { rule } as unknown as RuleMap);

		expect(mocks.stringify).toHaveBeenCalledWith({ a: 1 }, "json");
	});
});
