/** @type {import('prettier').Config} */
const config = {
	plugins: ["prettier-plugin-astro", "prettier-plugin-astro-organize-imports"],
	overrides: [
		{
			files: "*.astro",
			options: { parser: "astro" },
		},
	],
};

export default config;
