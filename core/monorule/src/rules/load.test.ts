import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ConfigSchema } from "@/schema";

const mocks = vi.hoisted(() => ({
	existsSync: vi.fn(),
	readdir: vi.fn(),
	register: vi.fn(),
	unregister: vi.fn(),
}));

vi.mock("node:fs", async (importOriginal) => {
	const original = await importOriginal<typeof import("node:fs")>();
	return {
		...original,
		existsSync: mocks.existsSync,
		promises: { ...original.promises, readdir: mocks.readdir },
	};
});

vi.mock("tsx/esm/api", () => ({ register: mocks.register }));

import { loadRules } from "./load";

const config = {
	ignorePaths: [],
	ignoreRules: [],
	ruleDirectory: "rules",
} satisfies ConfigSchema;

describe("loadRules", () => {
	beforeEach(() => {
		mocks.register.mockReturnValue(mocks.unregister);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return an empty array when the rule directory is missing", async () => {
		mocks.existsSync.mockReturnValue(false);

		const result = await loadRules(config, "/repo/monorule.config.ts");

		expect(result).toEqual([]);
		expect(mocks.readdir).not.toHaveBeenCalled();
	});

	it("should register/unregister tsx and return [] for an empty directory", async () => {
		mocks.existsSync.mockReturnValue(true);
		mocks.readdir.mockResolvedValue([]);

		const result = await loadRules(config, "/repo/monorule.config.ts");

		expect(result).toEqual([]);
		expect(mocks.register).toHaveBeenCalled();
		expect(mocks.unregister).toHaveBeenCalled();
	});
});
