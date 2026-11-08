import { createAnthropicChat } from "@tanstack/ai-anthropic";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { ollamaText } from "@tanstack/ai-ollama";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getProvider } from "../src/ai";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

vi.mock("@tanstack/ai-anthropic", () => ({
	createAnthropicChat: vi.fn((model) => ({ model, type: "anthropic" })),
}));

vi.mock("@tanstack/ai-gemini", () => ({
	createGeminiChat: vi.fn((model) => ({ model, type: "google" })),
}));

vi.mock("@tanstack/ai-openai", () => ({
	createOpenaiChat: vi.fn((model) => ({ model, type: "openai" })),
}));

vi.mock("@tanstack/ai-ollama", () => ({
	ollamaText: vi.fn((model) => ({ model, type: "ollama" })),
}));

/* eslint-enable @typescript-eslint/no-unsafe-assignment */

const googleKeys = [
	"GOOGLE_GENERATIVE_AI_API_KEY",
	"GOOGLE_API_KEY",
	"GEMINI_API_KEY",
] as const;

const anthropicKeys = [
	"ANTHROPIC_AUTH_TOKEN",
	"ANTHROPIC_OAUTH_TOKEN",
	"ANTHROPIC_API_KEY",
] as const;

describe("ai", () => {
	const originalEnvironment = process.env;

	afterEach(() => {
		process.env = originalEnvironment;
		vi.clearAllMocks();
	});

	function withoutGoogleKeys() {
		const environment = { ...originalEnvironment };
		for (const key of googleKeys) delete environment[key];
		return environment;
	}

	function withoutAnthropicKeys() {
		const environment = { ...originalEnvironment };
		for (const key of anthropicKeys) delete environment[key];
		return environment;
	}

	it("should return anthropic provider with ANTHROPIC_API_KEY", () => {
		process.env = {
			...withoutAnthropicKeys(),
			ANTHROPIC_API_KEY: "sk-ant-api",
		};
		const result = getProvider("anthropic", "claude-opus-5-5");
		expect(result.isOk()).toBe(true);
		expect(createAnthropicChat).toHaveBeenCalledWith(
			"claude-opus-5-5",
			"sk-ant-api",
			{ auth: "api-key" },
		);
	});

	it("should send ANTHROPIC_AUTH_TOKEN as a bearer token", () => {
		process.env = {
			...withoutAnthropicKeys(),
			ANTHROPIC_API_KEY: "sk-ant-api",
			ANTHROPIC_AUTH_TOKEN: "gateway-token",
		};
		getProvider("anthropic", "claude-opus-5-5");
		expect(createAnthropicChat).toHaveBeenCalledWith(
			"claude-opus-5-5",
			"gateway-token",
			{ auth: "bearer" },
		);
	});

	it("should send a claude oauth token with oauth auth", () => {
		process.env = {
			...withoutAnthropicKeys(),
			ANTHROPIC_AUTH_TOKEN: "sk-ant-oat-123",
		};
		getProvider("anthropic", "claude-opus-5-5");
		expect(createAnthropicChat).toHaveBeenCalledWith(
			"claude-opus-5-5",
			"sk-ant-oat-123",
			{ auth: "oauth" },
		);
	});

	it("should use ANTHROPIC_OAUTH_TOKEN with oauth auth", () => {
		process.env = {
			...withoutAnthropicKeys(),
			ANTHROPIC_API_KEY: "sk-ant-api",
			ANTHROPIC_OAUTH_TOKEN: "oauth-token",
		};
		getProvider("anthropic", "claude-opus-5-5");
		expect(createAnthropicChat).toHaveBeenCalledWith(
			"claude-opus-5-5",
			"oauth-token",
			{ auth: "oauth" },
		);
	});

	it("should skip a blank anthropic token in favor of a valid key", () => {
		process.env = {
			...withoutAnthropicKeys(),
			ANTHROPIC_API_KEY: "sk-ant-api",
			ANTHROPIC_AUTH_TOKEN: "  ",
		};
		getProvider("anthropic", "claude-opus-5-5");
		expect(createAnthropicChat).toHaveBeenCalledWith(
			"claude-opus-5-5",
			"sk-ant-api",
			{ auth: "api-key" },
		);
	});

	it("should fail anthropic provider when env is missing", () => {
		process.env = withoutAnthropicKeys();

		const result = getProvider("anthropic", "claude-opus-5-5");
		expect(result.isErr()).toBe(true);
	});

	it.each(googleKeys)(
		"should return google provider when %s is set",
		(key) => {
			process.env = { ...withoutGoogleKeys(), [key]: "test-key" };
			const result = getProvider("google", "gemini-pro");
			expect(result.isOk()).toBe(true);
			expect(createGeminiChat).toHaveBeenCalledWith(
				"gemini-pro",
				"test-key",
			);
		},
	);

	it("should prefer GOOGLE_GENERATIVE_AI_API_KEY over other google keys", () => {
		process.env = {
			...withoutGoogleKeys(),
			GEMINI_API_KEY: "gemini-key",
			GOOGLE_GENERATIVE_AI_API_KEY: "legacy-key",
		};
		getProvider("google", "gemini-pro");
		expect(createGeminiChat).toHaveBeenCalledWith(
			"gemini-pro",
			"legacy-key",
		);
	});

	it("should skip a blank google key in favor of a valid one", () => {
		process.env = {
			...withoutGoogleKeys(),
			GEMINI_API_KEY: "gemini-key",
			GOOGLE_GENERATIVE_AI_API_KEY: "  ",
		};
		const result = getProvider("google", "gemini-pro");
		expect(result.isOk()).toBe(true);
		expect(createGeminiChat).toHaveBeenCalledWith(
			"gemini-pro",
			"gemini-key",
		);
	});

	it("should fail google provider when env is missing", () => {
		process.env = withoutGoogleKeys();

		const result = getProvider("google", "gemini-pro");
		expect(result.isErr()).toBe(true);
	});

	it("should return openai provider when env is valid", () => {
		process.env = { ...originalEnvironment, OPENAI_API_KEY: "test-key" };
		const result = getProvider("openai", "gpt-4");
		expect(result.isOk()).toBe(true);
		expect(createOpenaiChat).toHaveBeenCalledWith("gpt-4", "test-key");
	});

	it("should fail openai provider when env is missing", () => {
		process.env = { ...originalEnvironment };
		delete process.env.OPENAI_API_KEY;

		const result = getProvider("openai", "gpt-4");
		expect(result.isErr()).toBe(true);
	});

	it("should return ollama provider (no env required by schema)", () => {
		process.env = { ...originalEnvironment };
		const result = getProvider("ollama", "llama2");
		expect(result.isOk()).toBe(true);
		expect(ollamaText).toHaveBeenCalledWith("llama2");
	});
});
