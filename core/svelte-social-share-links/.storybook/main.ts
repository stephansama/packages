import type { StorybookConfig } from "@storybook/svelte-vite";

import path from "node:path";
import * as url from "node:url";

/**
 * This function is used to resolve the absolute path of a package. It is needed
 * in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
	return path.dirname(
		url.fileURLToPath(import.meta.resolve(`${value}/package.json`)),
	);
}

const config: StorybookConfig = {
	addons: [
		getAbsolutePath("@storybook/addon-svelte-csf"),
		getAbsolutePath("@chromatic-com/storybook"),
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-a11y"),
	],
	framework: {
		name: getAbsolutePath("@storybook/svelte-vite"),
		options: {},
	},
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|ts|svelte)"],
};

export default config;
