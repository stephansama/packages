import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import asciinema from "@stephansama/remark-asciinema";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [[asciinema, { embedType: "script" }]],
	},
	site: "https://example.com",
});
