import starlight from "@astrojs/starlight";
import starlightCatppuccin from "@catppuccin/starlight";
import starlightTypeDoc, {
	typeDocSidebarGroup,
} from "@stephansama/starlight-typedoc";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import starlightGiscus from "starlight-giscus";
import starlightGithubAlerts from "starlight-github-alerts";
import starlightHeadingBadges from "starlight-heading-badges";
import starlightLlmsTxt from "starlight-llms-txt";
import { starlightIconsPlugin } from "starlight-plugin-icons";

const js = String.raw;

const script = js`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PJ2232VH');`;

export default defineConfig({
	integrations: [
		icon(),
		starlight({
			components: {
				SkipLink: "./src/components/skip-link.astro",
			},
			customCss: ["./src/extend.css"],
			favicon: "./src/favicon.svg",
			head: [{ attrs: { src: script }, tag: "script" }],
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
