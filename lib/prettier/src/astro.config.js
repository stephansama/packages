/** @type {import('prettier').Config} */
const config = {
	overrides: [
		{
			files: "*.astro",
			options: { parser: "astro" },
		},
	],
	plugins: ["prettier-plugin-astro", "prettier-plugin-astro-organize-imports"],
};

export default config;
