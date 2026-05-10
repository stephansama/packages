import type { CatppuccinColors } from "@catppuccin/palette";

import * as fsp from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";

export function convertColors(colors: CatppuccinColors) {
	return Object.fromEntries(
		Object.entries(colors).map(([key, value]) => [key, value.hex]),
	);
}

export async function writeFile(filename: string, contents: string) {
	const writeFilename = path.join(
		path.dirname(url.fileURLToPath(import.meta.url)),
		"../dist/",
		filename,
	);

	await fsp.mkdir(path.dirname(writeFilename), { recursive: true });
	await fsp.writeFile(writeFilename, contents);
}
