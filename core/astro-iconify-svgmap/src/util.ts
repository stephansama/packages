import type { IconifyJSON } from "@iconify/types";

import { getIconData } from "@iconify/utils/lib/icon-set/get-icon";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { iconToSVG } from "@iconify/utils/lib/svg/build";
import { iconToHTML } from "@iconify/utils/lib/svg/html";
import { replaceIDs } from "@iconify/utils/lib/svg/id";
import fs from "node:fs";

import type { Options } from "./type";

export function buildEnd(
	collections: Record<string, IconifyJSON>,
	usage: Record<string, string[]>,
	options: Options,
) {
	for (const pack of Object.keys(usage)) {
		const usedIcons = usage[pack];
		const collection = collections[pack];
		if (!collection) continue;

		const source = generateSprite(collection, usedIcons || []);
		const filename = [options.outDir, `${pack}.svg`].join("/");

		fs.writeFileSync(filename, source);
	}
}

export function generateSprite(packIcons: IconifyJSON, loaded: string[]) {
	let str = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n`;
	for (const icon of loaded) {
		const data = getIconData(packIcons, icon);
		if (!data) {
			console.error("unable to find icon", icon);
			continue;
		}
		const svg = iconToSVG(data);
		const html = iconToHTML(replaceIDs(svg.body), svg.attributes);
		str += html
			.replace(/svg/g, "symbol")
			.replace(/xmlns=\S+/, `id="${icon}"`)
			.replace(/width=\S+/, "")
			.replace(/height=\S+/, "");
	}
	str += `\n</svg>`;
	return str;
}

export async function loadIcons(options: Options) {
	const text = fs.readFileSync(
		new URL("./package.json", options?.iconifyRootDirectory),
		{ encoding: "utf8" },
	);
	const { dependencies = {}, devDependencies = {} } = JSON.parse(text);
	const packages: string[] = [
		...Object.keys(dependencies),
		...Object.keys(devDependencies),
	];
	const collections = packages
		.filter((name) => name.startsWith("@iconify-json/"))
		.map((name) => name.replace("@iconify-json/", ""));

	if (!collections.length) {
		throw new Error("must have at least one iconify pack loaded");
	}

	const allIcons: [string, IconifyJSON | undefined][] = await Promise.all(
		collections.map(async (collection) => [
			collection,
			await loadCollectionFromFS(
				collection,
				true,
				"@iconify-json",
				options?.iconifyRootDirectory?.toString(),
			),
		]),
	);

	return allIcons.reduce(
		(prev, [name, value]) => ({ ...prev, [name]: value }),
		{},
	);
}
