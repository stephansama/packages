#!/usr/bin/env tsx

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import path from "node:path";

const md = String.raw;
const template = md`
[![socket.dev](https://badge.socket.dev/npm/package/{{package}})](https://socket.dev/npm/package/{{package}}/overview)
`;

const { packages } = await getPackages(process.cwd());

for (const pkg of packages) {
	if (!pkg.relativeDir.startsWith("core")) continue;

	const readmePath = path.resolve(pkg.dir, "README.md");
	const readmeFile = await fs.promises.readFile(readmePath, "utf8");
	const currentTemplate = template.replaceAll(
		"{{package}}",
		pkg.packageJson.name,
	);

	if (readmeFile.includes(currentTemplate)) continue;

	const lines = readmeFile.split("\n");
	const indexOfNpmVersion = lines.findIndex((line) =>
		line.startsWith("[![NPM Version]"),
	);

	const body = [
		...lines.slice(0, indexOfNpmVersion),
		currentTemplate,
		...lines.slice(indexOfNpmVersion),
	].join("\n");

	await fs.promises.writeFile(readmePath, body, "utf8");
}
