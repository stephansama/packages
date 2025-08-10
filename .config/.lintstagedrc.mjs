const jsLike = "{js,cjs,mjs,jsx,ts,mts,cts,tsx,astro,svelte,vue}";

/**
 * @see https://www.npmjs.com/package/lint-staged#configuration
 * @type {import('lint-staged').Configuration}
 */
const config = {
	[`!(*.${jsLike})`]: "prettier --write",
	[`*.${jsLike}`]: [
		"eslint --fix",
		"prettier --write",
		"vitest related --run",
	],
};

export default config;
