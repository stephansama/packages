#!/usr/bin/env node

import { markdownTable } from "markdown-table";
import * as fsp from "node:fs/promises";

const opts = { /** @type {BufferEncoding} */ encoding: "utf8" };

const pkgs = (await fsp.readdir("../../packages/")).filter(
	(dir) => dir !== "example",
);

const serviceMap = {
	["npm"]: "https://www.npmjs.com/package/@stephansama/{{name}}",
	["shield-downloads"]:
		"https://img.shields.io/npm/dw/@stephansama/{{name}}?labelColor=211F1F",
	["shield-version"]:
		"https://img.shields.io/npm/v/%40stephansama%2F{{name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F",
	["typedoc"]:
		"https://packages.stephansama.info/modules/_stephansama_{{name}}",
};

/**
 * @param {string} packageName
 * @param {keyof typeof serviceMap} service
 */
function createUrl(packageName, service) {
	const map = serviceMap[service];
	if (map) return map.replace("{{name}}", packageName);
	throw new Error(`unable to create url based on service ${service}`);
}

const table = markdownTable([
	["NAME", "VERSION", "DOWNLOADS"],
	...pkgs.map((pkg) => {
		return [
			`[${pkg}](${createUrl(pkg, "typedoc")})`,
			`[![NPM VERSION](${createUrl(pkg, "shield-version")})](${createUrl(pkg, "npm")})`,
			`[![NPM DOWNLOADS](${createUrl(pkg, "shield-downloads")})](${createUrl(pkg, "npm")})`,
		];
	}),
]);

const readme = await fsp.readFile("../../README.md", opts);
const readmeLines = readme.split("\n");
const [startIndex, endIndex] = ["<!-- PKG:START -->", "<!-- PKG:END -->"].map(
	(tag) => readmeLines.findIndex((line) => line === tag),
);
const start = startIndex + 1;
const end = Math.max(0, endIndex - startIndex - 1);

readmeLines.splice(start, end, table);

const newBody = readmeLines.join("\n");

await fsp.writeFile("../../README.md", newBody);
