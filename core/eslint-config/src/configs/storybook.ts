import type { Config } from "eslint/config";

import storybook from "eslint-plugin-storybook";

export const autoEnableModules = ["storybook"] as const;

export function config(): Config[] {
	return [
		{
			...storybook.configs["flat/recommended"],
			name: "stephansama/storybook",
		},
	];
}
