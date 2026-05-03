import type { LanguageModel } from "ai";

import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { err, ok, Result } from "neverthrow";
import { ollama } from "ollama-ai-provider-v2";

import { environmentSchema, type Provider } from "./schema";

const providerMap: Record<Provider, (model: string) => LanguageModel> = {
	google: google,
	ollama: ollama,
	openai: openai,
};

export function getProvider(
	provider: Provider,
	model: string,
): Result<LanguageModel, Error> {
	const result = environmentSchema[provider].safeParse(process.env);

	if (result.error) return err(new Error(result.error.message));

	const selected = providerMap[provider];

	if (selected) return ok(selected(model));

	return err(new Error("unable to find message"));
}
