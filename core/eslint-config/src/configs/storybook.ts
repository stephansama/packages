import type { Config } from "eslint/config";

import { ensurePackages } from "@/environment";

export async function config(): Promise<Config[]> {
	await ensurePackages("eslint-plugin-storybook");

	const storybook = await import("eslint-plugin-storybook");

	return [
		{
			...storybook.configs["flat/recommended"],
			name: "stephansama/storybook",
		},
	];
}
