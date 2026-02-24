import { describe, expect, it } from "vitest";

import {
	configSchema,
	defaultPrompt,
	envSchema,
	providers,
	providerSchema,
} from "../src/schema";

describe("schema", () => {
	describe("constants", () => {
		it("should have valid default prompt", () => {
			expect(defaultPrompt).toContain("{{diff}}");
			expect(defaultPrompt).toContain("conventional commit message");
		});

		it("should have correct providers list", () => {
			expect(providers).toEqual(["google", "openai", "ollama"]);
		});
	});

	describe("providerSchema", () => {
		it("should validate correct providers", () => {
			expect(providerSchema.safeParse("google").success).toBe(true);
			expect(providerSchema.safeParse("openai").success).toBe(true);
			expect(providerSchema.safeParse("ollama").success).toBe(true);
		});

		it("should fail for invalid providers", () => {
			expect(providerSchema.safeParse("invalid").success).toBe(false);
		});
	});

	describe("envSchema", () => {
		it("should validate google env", () => {
			const valid = { GOOGLE_GENERATIVE_AI_API_KEY: "key" };
			const result = envSchema.google.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it("should validate openai env", () => {
			const valid = { OPENAI_API_KEY: "key" };
			const result = envSchema.openai.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it("should validate ollama env (empty object allowed)", () => {
			const valid = {};
			const result = envSchema.ollama.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});

	describe("configSchema", () => {
		it("should parse valid minimal config", () => {
			const config = {
				model: "gemini-2.5-flash",
				provider: "google",
			};
			const result = configSchema.safeParse(config);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.prompt).toBe(defaultPrompt);
				expect(result.data.useConventionalCommits).toBe(true);
				expect(result.data.verbose).toBe(0);
			}
		});

		it("should parse full config", () => {
			const config = {
				model: "gpt-4",
				prompt: "custom prompt",
				provider: "openai",
				skipNextRun: true,
				useConventionalCommits: false,
				verbose: 2,
			};
			const result = configSchema.safeParse(config);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.prompt).toBe("custom prompt");
				expect(result.data.verbose).toBe(2);
			}
		});

		it("should fail if model is missing", () => {
			const config = {
				provider: "google",
			};
			const result = configSchema.safeParse(config);
			expect(result.success).toBe(false);
		});
	});
});
