const jsLike = "{js,cjs,mjs,jsx,ts,mts,cts,tsx,astro,svelte,vue}";

/**
 * @see https://www.npmjs.com/package/lint-staged#configuration
 * @type {import('lint-staged').Configuration}
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
