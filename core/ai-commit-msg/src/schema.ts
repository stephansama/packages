import * as z from "zod";

export const defaultPrompt = `generate a conventional commit message based on the following diff. the subject should be all lowercase. and lines should not exceed 100 characters \n\n{{diff}}`;

export const models = ["gemini-2.5-flash"] as const;
export type Model = (typeof models)[number];

export const providers = ["google", "openai", "ollama"] as const;
export type Provider = (typeof providers)[number];

export const envSchema = {
	google: z.object({ GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1) }),
	ollama: z.object({}),
	openai: z.object({ OPENAI_API_KEY: z.string().min(1) }),
} satisfies Partial<Record<Provider, z.ZodType>>;

export const providerSchema = z.enum(providers);

export const configSchema = z.object({
	baseURL: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	model: z.string().meta({
		description: "model to use from provider",
	}),
	prompt: z.string().default(defaultPrompt).meta({
		description: "prompt used to fuel generated commit",
	}),
	provider: providerSchema,
	useConventionalCommits: z.boolean().default(true),
	verbose: z.literal([0, 1, 2, 3]).default(0),
});

export type Config = Partial<z.infer<typeof configSchema>>;
