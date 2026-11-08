import type { AnyTextAdapter } from "@tanstack/ai";
import type {
	AnthropicChatModel,
	AnthropicTextConfig,
} from "@tanstack/ai-anthropic";
import type { GeminiTextModel } from "@tanstack/ai-gemini";
import type { OpenAIChatModel } from "@tanstack/ai-openai";

import { createAnthropicChat } from "@tanstack/ai-anthropic";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { ollamaText } from "@tanstack/ai-ollama";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { Result } from "better-result";

import type { Model, Provider } from "./schema";

import { environmentSchema } from "./schema";

type ProviderFactory = (
	model: Model,
	environment: Record<string, string | undefined>,
) => AnyTextAdapter;

// model may be any string, so it is cast to each adapter's known model union.
// the adapters pass unknown model names through at runtime
const providerMap: Record<Provider, ProviderFactory> = {
	anthropic: (model, environment) => {
		const { auth, credential } = getAnthropicCredential(environment);
		return createAnthropicChat(model as AnthropicChatModel, credential, {
			auth,
		});
	},
	google: (model, environment) =>
		createGeminiChat(
			model as GeminiTextModel,
			getGoogleApiKey(environment),
		),
	ollama: (model) => ollamaText(model),
	openai: (model, environment) =>
		createOpenaiChat(model as OpenAIChatModel, environment.OPENAI_API_KEY!),
};

export function getProvider(
	provider: Provider,
	model: Model,
): Result<AnyTextAdapter, Error> {
	const result = environmentSchema[provider].safeParse(process.env);

	if (result.error) return Result.err(new Error(result.error.message));

	const selected = providerMap[provider];

	if (selected) return Result.ok(selected(model, result.data));

	return Result.err(new Error("unable to find message"));
}

// same order and auth kinds as the adapter's own env lookup (anthropicText),
// but reading the trimmed values so a blank variable does not win
function getAnthropicCredential(
	environment: Record<string, string | undefined>,
): { auth: AnthropicTextConfig["auth"]; credential: string } {
	const authToken = environment.ANTHROPIC_AUTH_TOKEN;
	if (authToken) {
		return {
			auth: authToken.includes("sk-ant-oat") ? "oauth" : "bearer",
			credential: authToken,
		};
	}

	if (environment.ANTHROPIC_OAUTH_TOKEN) {
		return { auth: "oauth", credential: environment.ANTHROPIC_OAUTH_TOKEN };
	}

	return { auth: "api-key", credential: environment.ANTHROPIC_API_KEY || "" };
}

function getGoogleApiKey(environment: Record<string, string | undefined>) {
	return (
		environment.GOOGLE_GENERATIVE_AI_API_KEY ||
		environment.GOOGLE_API_KEY ||
		environment.GEMINI_API_KEY ||
		""
	);
}
