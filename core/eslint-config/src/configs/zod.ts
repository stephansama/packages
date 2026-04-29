import type { Config } from "eslint/config";

import zod from "eslint-plugin-zod";

export const autoEnableModules = ["zod"] as const;

export function config(): Config[] {
	return [zod.configs.recommended];
}
