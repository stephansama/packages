import type { IconifyJSON } from "@iconify/types";

import { getIconData } from "@iconify/utils/lib/icon-set/get-icon";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { iconToSVG } from "@iconify/utils/lib/svg/build";
import { iconToHTML } from "@iconify/utils/lib/svg/html";
import { replaceIDs } from "@iconify/utils/lib/svg/id";
import * as fs from "node:fs";

import type { Options } from "./type";

const regexes = {
	height: /height=\S+/,
	width: /width=\S+/,
	xml: /xmlns=\S+/,
};

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
	let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n`;
	for (const icon of loaded) {
		const data = getIconData(packIcons, icon);
		if (!data) {
			console.error("unable to find icon", icon);
			continue;
		}
		const svg = iconToSVG(data);
		const html = iconToHTML(replaceIDs(svg.body), svg.attributes);
		svgHtml += html
			.replaceAll("svg", "symbol")
			.replaceAll(regexes.xml, `id="${icon}"`)
			.replaceAll(regexes.width, "")
			.replaceAll(regexes.height, "");
	}
	svgHtml += `\n</svg>`;
	return svgHtml;
}

export async function loadIcons(options: Options) {
	const text = fs.readFileSync(
		new URL("package.json", options?.iconifyRootDirectory),
		{ encoding: "utf8" },
	);
	const { dependencies = {}, devDependencies = {} } =
		(JSON.parse(text) as Record<string, Record<string, string>>) || {};
	const packages: string[] = [
		...Object.keys(dependencies),
		...Object.keys(devDependencies),
	];
	const collections = packages
		.filter((name) => name.startsWith("@iconify-json/"))
		.map((name) => name.replace("@iconify-json/", ""));

	if (collections.length === 0) {
		throw new Error("must have at least one iconify pack loaded");
	}

	const awaitedIcons = await Promise.all(
		collections.map(async (collection) => {
			const loaded = await loadCollectionFromFS(
				collection,
				true,
				"@iconify-json",
				options?.iconifyRootDirectory?.toString(),
			);
			if (!loaded) return;
			return [collection, loaded];
		}),
	);

	const allIcons = awaitedIcons.filter(
		(item): item is [string, IconifyJSON] => !!item,
	);

	return Object.fromEntries(allIcons.map(([name, value]) => [name, value]));
}
