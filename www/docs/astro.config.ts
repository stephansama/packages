import starlight from "@astrojs/starlight";
import starlightCatppuccin from "@catppuccin/starlight";
import { defineConfig } from "astro/config";
import starlightGiscus from "starlight-giscus";
import starlightGithubAlerts from "starlight-github-alerts";
import starlightLlmsTxt from "starlight-llms-txt";
import { starlightIconsPlugin } from "starlight-plugin-icons";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

export default defineConfig({
	integrations: [
		starlight({
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
				starlightIconsPlugin(),
				starlightLlmsTxt(),
				starlightTypeDoc({
					entryPoints: ["../../core/*"],
					tsconfig: "../../tsconfig.json",
					typeDoc: {
						entryPointStrategy: "packages",
						exclude: [
							"../../core/alfred-kaomoji/",
							"../../core/catppuccin-opml/",
							"../../core/catppuccin-rss/",
							"../../core/github-env/",
						],
						excludeExternals: true,
						hideBreadcrumbs: true,
						indexFormat: "htmlTable",
						jsDocCompatibility: true,
						name: "@stephansama packages",
						packageOptions: {
							entryPoints: ["src/*"],
							exclude: [
								"**/*.spec.ts",
								"**/*.test.ts",
								"**/tests/**",
								"**/{node_modules,test,book,doc,dist}/**/*",
								"**/{pages,components}/**",
								"node_modules",
								"tsdown.config.ts",
							],
							excludeExternals: true,
							jsDocCompatibility: true,
							readme: "./README.md",
							skipErrorChecking: true,
							tsconfig: "./tsconfig.json",
						},
						readme: "../../README.md",
						skipErrorChecking: true,
						useCodeBlocks: true,
					},
				}),
			],
			sidebar: [typeDocSidebarGroup],
			title: "@stephansama packages",
		}),
	],
	site: "https://packages.stephansama.info",
});
