import type { GeminiTextModel } from "@tanstack/ai-gemini";
import type { OllamaTextModels } from "@tanstack/ai-ollama";
import type { OpenAIChatModel } from "@tanstack/ai-openai";

import * as z from "zod";

export const defaultPrompt = `generate a conventional commit message based on the following diff. the subject should be all lowercase, and lines should not exceed 100 characters \n\n{{diff}}`;

export const intentPrompt = `the author already wrote the following commit message. use it as the source of intent: keep what it says the change does and why, and do not replace that with a different interpretation of the diff. the result must still follow every formatting rule above (for conventional commits, include the type prefix), using the diff to fill in or correct details.\n\n{{message}}`;

export const models = ["gemini-2.5-flash"] as const;

/** Model names the provider adapters know about */
export type KnownModel =
	| (typeof OllamaTextModels)[number]
	| GeminiTextModel
	| OpenAIChatModel;

/** A known model name (for autocompletion) or any other model string */
export type Model = KnownModel | (string & {});

export const providers = ["google", "openai", "ollama"] as const;
export type Provider = (typeof providers)[number];

export const environmentSchema = {
	google: z
		.object({
			GEMINI_API_KEY: z.string().trim().optional(),
			GOOGLE_API_KEY: z.string().trim().optional(),
			GOOGLE_GENERATIVE_AI_API_KEY: z.string().trim().optional(),
		})
		.refine(
			(environment) =>
				environment.GOOGLE_GENERATIVE_AI_API_KEY ||
				environment.GOOGLE_API_KEY ||
				environment.GEMINI_API_KEY,
			{
				error: "one of GOOGLE_GENERATIVE_AI_API_KEY, GOOGLE_API_KEY, or GEMINI_API_KEY is required",
			},
		),
	ollama: z.object({}),
	openai: z.object({ OPENAI_API_KEY: z.string().trim().min(1) }),
} satisfies Partial<Record<Provider, z.ZodType>>;

export const providerSchema = z.enum(providers);

export const configSchema = z.object({
	baseURL: z.string().trim().optional(),
	headers: z.record(z.string(), z.string().trim()).optional(),
	model: z.string().trim().meta({
		description: "model to use from provider",
	}) as z.ZodType<Model>,
	prompt: z.string().trim().default(defaultPrompt).meta({
		description:
			"prompt used to fuel generated commit. {{diff}} is replaced with the staged diff and {{message}} with the existing commit message (if any)",
	}),
	provider: providerSchema,
	skipNextRun: z.boolean().optional().meta({
		description:
			"skip the next git hook invocation (usually used when manually running cli)",
	}),
	useConventionalCommits: z.boolean().default(true),
	verbose: z
		.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
		.default(0),
});

export type Config = Partial<z.infer<typeof configSchema>>;
