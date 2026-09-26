import iconifySvgmap from "@stephansama/vite-iconify-svgmap";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [iconifySvgmap(), prerender()],
});

/**
 * Renders `src/render.js` into index.html during development. `build.js` does
 * the same for production builds.
 *
 * @returns {import("vite").Plugin}
 */
function prerender() {
	return {
		apply: "serve",
		name: "example:prerender",
		async transformIndexHtml(html, { server }) {
			if (!server) return html;
			const { render } = await server.ssrLoadModule("/src/render.js");
			return html.replace("<!--app-html-->", render());
		},
	};
}
