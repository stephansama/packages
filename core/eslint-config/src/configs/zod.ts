import type { Config } from "eslint/config";

import { ensurePackages } from "@/environment";

export const autoEnableModules = ["zod"] as const;

export async function config(): Promise<Config[]> {
	await ensurePackages("eslint-plugin-zod");
	const zod = await import("eslint-plugin-zod");
	return [zod.default.configs.recommended];
}
