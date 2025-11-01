import { defineConfig } from "vitepress";

import typedocSidebar from "../api/typedoc-sidebar.json" with { type: "json" };

const html = String.raw;

// https://vitepress.dev/reference/site-config
export default defineConfig({
	description:
		"Documentation on how to use the mad professor suite of utilities",
	head: [
		["link", { href: "/favicon.svg", rel: "icon" }],
		[
			"meta",
			{
				content:
					"https://og.madprofessorblog.org/api/foss/packages.png",
				property: "og:image",
			},
		],
	],
	ignoreDeadLinks: true,
	lastUpdated: true,
	markdown: {
		theme: { dark: "catppuccin-mocha", light: "catppuccin-latte" },
	},
	outDir: "../../dist",
	sitemap: { hostname: "https://packages.stephansama.info" },
	themeConfig: {
		footer: {
			copyright: `Copyright © ${new Date().getFullYear()} - @stephansama`,
			message: "Released under MIT license",
		},
		nav: [
			{
				link: "/eslint",
				target: "_self",
				text: iconLink({
					icon: { name: "eslint", pack: "logos" },
					title: "Eslint",
				}),
			},
			{
				link: "/node_modules",
				target: "_self",
				text: iconLink({
					icon: { name: "nodejs-icon-alt", pack: "logos" },
					title: "Node Modules",
				}),
			},
			{
				link: "https://madprofessorblog.org",
				target: "_self",
				text: "Blog",
			},
		],
		search: { options: { detailedView: true }, provider: "local" },
		sidebar: [{ items: typedocSidebar, link: "/api", text: "API" }],
		socialLinks: [
			{
				icon: "bluesky",
				link: "https://bsky.app/profile/stephansama.bsky.social",
			},
			{
				icon: "linkedin",
				link: "https://www.linkedin.com/in/stephan-randle-38a30319a/",
			},
			{
				icon: "npm",
				link: "https://www.npmjs.com/~stephansama",
			},
			{
				icon: "github",
				link: "https://github.com/stephansama",
			},
		],
	},
	title: "@stephansama packages",
});

function iconLink({
	icon,
	title,
}: {
	icon: { name: string; pack: string };
	title: string;
}) {
	return html`<div style="display:flex;gap:4px;">
		<img src="https://api.iconify.design/${icon.pack}:${icon.name}.svg" />
		${title}
	</div>`;
}
