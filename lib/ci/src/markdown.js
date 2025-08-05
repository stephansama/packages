#!/usr/bin/env node

import { markdownTable } from "markdown-table";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";

/** @type {BufferEncoding} */
const encoding = "utf8";

const opts = { encoding };

const readme = await fsp.readFile("../../README.md", opts);

const pkgRoot = "../../packages/";

const pkgDir = await fsp.readdir(pkgRoot);

/** @type {{ name: string }[]}  */
const pkgJsons = await Promise.all(
	pkgDir
		.filter((dir) => dir !== "example")
		.map(async (dir) => {
			const url = pkgRoot + dir + "/package.json";
			if (!fs.existsSync(url)) return false;
			const file = await fsp.readFile(url, opts);
			const json = JSON.parse(file);
			return json;
		})
		.filter(Boolean),
);

/**
 * @param {string} packageName
 * @param {'npm'|'shield-downloads'|'shield-version'|'typedoc'} service
 */
function createUrl(packageName, service) {
	packageName = packageName.replace("@stephansama/", "");
	if (service === "npm") {
		return `https://www.npmjs.com/package/@stephansama/${packageName}`;
	}
	if (service === "shield-downloads") {
		return `https://img.shields.io/npm/dw/@stephansama/${packageName}?labelColor=211F1F`;
	}
	if (service === "shield-version") {
		return `https://img.shields.io/npm/v/%40stephansama%2F${packageName}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F`;
	}
	return `https://packages.stephansama.info/modules/_stephansama_${packageName}`;
}

const table = markdownTable([
	["NAME", "VERSION", "DOWNLOADS"],
	...pkgJsons.map((json) => {
		return [
			`[${json.name}](${createUrl(json.name, "typedoc")})`,
			`[![NPM VERSION](${createUrl(json.name, "shield-version")})](${createUrl(json.name, "npm")})`,
			`[![NPM DOWNLOADS](${createUrl(json.name, "shield-downloads")})](${createUrl(json.name, "npm")})`,
		];
	}),
]);

const readmeLines = readme.split("\n");
const [startIndex, endIndex] = ["<!-- PKG:START -->", "<!-- PKG:END -->"].map(
	(tag) => readmeLines.findIndex((line) => line === tag),
);
const start = startIndex + 1;
const end = Math.max(0, endIndex - startIndex - 1);

readmeLines.splice(start, end, table);

const newBody = readmeLines.join("\n");

await fsp.writeFile("../../README.md", newBody);
