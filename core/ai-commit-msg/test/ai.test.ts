import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { ollama } from "ollama-ai-provider-v2";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getProvider } from "../src/ai";

vi.mock("@ai-sdk/google", () => ({
	google: vi.fn((model) => ({ model, type: "google" })),
}));

vi.mock("@ai-sdk/openai", () => ({
	openai: vi.fn((model) => ({ model, type: "openai" })),
}));

vi.mock("ollama-ai-provider-v2", () => ({
	ollama: vi.fn((model) => ({ model, type: "ollama" })),
}));

describe.skip("ai", () => {
	const originalEnv = process.env;

	afterEach(() => {
		process.env = originalEnv;
		vi.clearAllMocks();
	});

	it("should return google provider when env is valid", () => {
		process.env = {
			...originalEnv,
			GOOGLE_GENERATIVE_AI_API_KEY: "test-key",
		};
		const result = getProvider("google", "gemini-pro");
		expect(result.isOk()).toBe(true);
		expect(google).toHaveBeenCalledWith("gemini-pro");
	});

	it("should fail google provider when env is missing", () => {
		process.env = { ...originalEnv };
		delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

		const result = getProvider("google", "gemini-pro");
		expect(result.isErr()).toBe(true);
	});

	it("should return openai provider when env is valid", () => {
		process.env = { ...originalEnv, OPENAI_API_KEY: "test-key" };
		const result = getProvider("openai", "gpt-4");
		expect(result.isOk()).toBe(true);
		expect(openai).toHaveBeenCalledWith("gpt-4");
	});

	it("should fail openai provider when env is missing", () => {
		process.env = { ...originalEnv };
		delete process.env.OPENAI_API_KEY;

		const result = getProvider("openai", "gpt-4");
		expect(result.isErr()).toBe(true);
	});

	it("should return ollama provider (no env required by schema)", () => {
		process.env = { ...originalEnv };
		const result = getProvider("ollama", "llama2");
		expect(result.isOk()).toBe(true);
		expect(ollama).toHaveBeenCalledWith("llama2");
	});
});
