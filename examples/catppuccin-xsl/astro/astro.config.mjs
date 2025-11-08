import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({
			changefreq: "weekly",
			lastmod: new Date(),
			priority: 1.0,
			xslURL: "/sitemap.xsl",
		}),
	],
	output: "static",
	site: "https://stephansama.info",
});
