import type { AnyTextAdapter } from "@tanstack/ai";

import { createGeminiChat, type GeminiTextModel } from "@tanstack/ai-gemini";
import { ollamaText } from "@tanstack/ai-ollama";
import { createOpenaiChat, type OpenAIChatModel } from "@tanstack/ai-openai";
import { err, ok, Result } from "neverthrow";

import { environmentSchema, type Model, type Provider } from "./schema";

type ProviderFactory = (
	model: Model,
	environment: Record<string, string | undefined>,
) => AnyTextAdapter;

// model may be any string, so it is cast to each adapter's known model union.
// the adapters pass unknown model names through at runtime
const providerMap: Record<Provider, ProviderFactory> = {
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

	if (result.error) return err(new Error(result.error.message));

	const selected = providerMap[provider];

	if (selected) return ok(selected(model, process.env));

	return err(new Error("unable to find message"));
}

function getGoogleApiKey(environment: Record<string, string | undefined>) {
	return (
		environment.GOOGLE_GENERATIVE_AI_API_KEY ||
		environment.GOOGLE_API_KEY ||
		environment.GEMINI_API_KEY ||
		""
	);
}
