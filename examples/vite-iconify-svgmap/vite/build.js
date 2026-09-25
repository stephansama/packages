import { writeSprites } from "@stephansama/vite-iconify-svgmap";
import fs from "node:fs/promises";
import { build } from "vite";

const serverDirectory = "dist/.server";

// 1. client build: static icon imports are emitted as hashed sprites
await build();

// 2. server build of the render entry
await build({
	build: {
		emptyOutDir: true,
		outDir: serverDirectory,
		rollupOptions: { output: { entryFileNames: "[name].mjs" } },
		ssr: "src/render.js",
	},
});

// 3. prerender; getIcon records every icon it sees in memory
const { render } = await import(`./${serverDirectory}/render.mjs`);
const html = await fs.readFile("dist/index.html", "utf8");
await fs.writeFile(
	"dist/index.html",
	html.replace("<!--app-html-->", render()),
);
await fs.rm(serverDirectory, { recursive: true });

// 4. write sprites for the icons registered while rendering
const written = await writeSprites("dist");
console.info(`wrote ${written.length} svg sprite(s)`);
