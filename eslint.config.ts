import { presets, stephansama } from "@stephansama/eslint-config";

export default stephansama(
	{
		...presets.base,
		...presets.library,
		...presets.pnpm,
	},
	{
		configs: [
			{
				files: ["**/kaomojis.json"],
				rules: {
					"no-irregular-whitespace": "warn",
				},
			},
			// {
			// 	rules: {
			// 		"markdown/heading-increment": "warn",
			// 	},
			// },
		],
	},
);
