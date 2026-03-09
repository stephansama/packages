import type { Theme } from "vitepress";

import CopyOrDownloadAsMarkdownButtons from "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue";
import DefaultTheme from "vitepress/theme";

import "./extend.css";

import "@catppuccin/vitepress/theme/mocha/red.css";

export default {
	enhanceApp({ app }) {
		app.component(
			"CopyOrDownloadAsMarkdownButtons",
			CopyOrDownloadAsMarkdownButtons,
		);
	},
	extends: DefaultTheme,
} satisfies Theme;

// export default DefaultTheme;
