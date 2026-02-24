import { cosmiconfig } from "cosmiconfig";
import { afterEach, describe, expect, it, vi } from "vitest";

import { loadConfig } from "../src/config";

vi.mock("cosmiconfig", () => ({
	cosmiconfig: vi.fn(),
	getDefaultSearchPlaces: vi.fn(() => []),
}));

describe("config", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return parsed config when found", async () => {
		const mockSearch = vi.fn().mockResolvedValue({
			config: {
				model: "test-model",
				provider: "openai",
				useConventionalCommits: false,
			},
		});
		(cosmiconfig as any).mockReturnValue({
			search: mockSearch,
		});

		const config = await loadConfig();
		expect(config.model).toBe("test-model");
		expect(config.provider).toBe("openai");
		expect(config.useConventionalCommits).toBe(false);
		expect(config.prompt).toBeDefined(); // Defaults should apply
	});

	it("should return default config when nothing found", async () => {
		const mockSearch = vi.fn().mockResolvedValue(null);
		(cosmiconfig as any).mockReturnValue({
			search: mockSearch,
		});

		const config = await loadConfig();
		expect(config.model).toBe("llama2");
		expect(config.provider).toBe("ollama");
		expect(config.useConventionalCommits).toBe(true);
	});

	it("should throw if config is invalid", async () => {
		const mockSearch = vi.fn().mockResolvedValue({
			config: {
				provider: "invalid-provider", // invalid enum
			},
		});
		(cosmiconfig as any).mockReturnValue({
			search: mockSearch,
		});

		await expect(loadConfig()).rejects.toThrow();
	});
});
