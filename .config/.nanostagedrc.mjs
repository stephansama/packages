const jsLike = "{js,cjs,mjs,jsx,ts,mts,cts,tsx,astro,svelte,vue}";

/**
 * @type {import("nano-staged").Configuration}
 * @see https://www.npmjs.com/package/lint-staged#configuration
 */
const config = {
	[`!(*.${jsLike})`]: "prettier --write --ignore-unknown",
	[`*.${jsLike}`]: [
		"eslint --fix",
		"prettier --write --ignore-unknown",
		"vitest related --run",
	],
};

export default config;
