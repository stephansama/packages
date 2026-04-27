import type { Config } from "eslint/config";

export const autoEnableModules = [
	"vue",
	"nuxt",
	"vitepress",
	"@slidev/cli",
] as const;

export function config(): Config[] {
	return [];
}
