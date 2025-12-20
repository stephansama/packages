import type { CatppuccinColors, ColorName } from "@catppuccin/palette";

import * as fsp from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

export function convertColors(colors: CatppuccinColors) {
	return Object.entries(colors)
		.map(([key, val]) => [key, val.hex])
		.reduce(
			(acc, [key, hex]) => {
				acc[key as keyof typeof acc] = hex;
				return acc;
			},
			{} as Record<ColorName, string>,
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
