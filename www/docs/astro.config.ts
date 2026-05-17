import starlight from "@astrojs/starlight";
import starlightCatppuccin from "@catppuccin/starlight";
import starlightTypeDoc, {
	typeDocSidebarGroup,
} from "@stephansama/starlight-typedoc";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlightGiscus from "starlight-giscus";
import starlightGithubAlerts from "starlight-github-alerts";
import starlightHeadingBadges from "starlight-heading-badges";
import starlightLlmsTxt from "starlight-llms-txt";
import { starlightIconsPlugin } from "starlight-plugin-icons";

const css = String.raw;

export default defineConfig({
	integrations: [
		starlight({
			customCss: ["./src/extend.css"],
			favicon: "./src/favicon.svg",
			head: [
				{
					attrs: {
						defer: true,
						src: "", // google tag manager
					},
					tag: "script",
				},
				{
					content: css`
						.content-panel:first-child:has(> .sl-container > h1#_top) {
							display: none;
						}
						.content-panel:nth-child(2) {
							border-top: 0;
						}
					`,
					tag: "style",
				},
			],
			logo: {
				src: "./src/favicon.svg",
			},
			plugins: [
				starlightCatppuccin({
					dark: { accent: "red", flavor: "macchiato" },
					light: { accent: "red", flavor: "latte" },
				}),
				starlightGiscus({
					category: "Packages",
					categoryId: "DIC_kwDOQXzR5s4C86Zx",
					repo: "stephansama/comments",
					repoId: "R_kgDOQXzR5g",
					theme: {
						dark: "catppuccin_mocha",
						light: "catppuccin_latte",
					},
				}),
				starlightGithubAlerts(),
				starlightHeadingBadges(),
				starlightIconsPlugin(),
				starlightLlmsTxt(),
				starlightTypeDoc({
					sidebar: {
						removeScope: true,
					},
				}),
			],
			sidebar: [typeDocSidebarGroup],
			social: [
				{
					href: "https://bsky.app/profile/stephansama.info",
					icon: "blueSky",
					label: "BlueSky",
				},
				{ href: "https://npmx.dev/~stephansama", icon: "npm", label: "NPM" },
				{
					href: "https://github.com/stephansama",
					icon: "github",
					label: "GitHub",
				},
				{
					href: "https://www.linkedin.com/in/stephan-randle-38a30319a/",
					icon: "linkedin",
					label: "LinkedIn",
				},
				{
					href: "https://www.youtube.com/@stephansama",
					icon: "youtube",
					label: "YouTube",
				},
			],
			title: "packages",
		}),
	],
	site: "https://packages.stephansama.info",
	vite: {
		plugins: [tailwindcss()],
	},
});
