/** @type {import('prettier').Config} */
const config = {
	jsxSingleQuote: false,
	overrides: [{ files: ["*.md"], options: { tabWidth: 2, useTabs: false } }],
	plugins: [
		"prettier-plugin-organize-imports",
		"prettier-plugin-sort-package-json",
	],
	quoteProps: "consistent",
	semi: true,
	singleQuote: false,
	useTabs: true,
};

export default config;
