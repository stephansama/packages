#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

const examples = fs.readdirSync("../../examples/");
const packages = fs.readdirSync("../../packages/");

const noExamples = packages.filter((pkg) => !examples.includes(pkg));

for (const pkg of packages) {
	const packageName = ["@stephansama", pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}

const templates = examples
	.map(
		(example) =>
			`'../../packages/${example}' --template '../../examples/${example}/*'`,
	)
	.join(" ");

const noTemplates = noExamples
	.map((pkg) => `'../../packages/${pkg}'`)
	.join(" ");

await sh`../../node_modules/.bin/pkg-pr-new publish --packageManager="pnpm" --pnpm ${templates} ${noTemplates}`;
