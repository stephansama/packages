#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

const examples = fs.readdirSync("../../examples/");
const packages = fs.readdirSync("../../packages/");

for (const pkg of packages) {
	const packageName = ["@stephansama", pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}

const templates = examples
	.map((example) => `--template './examples/${example}/*'`)
	.join(" ");

await sh`pnpx pkg-pr-new publish --pnpm './packages/*' ${templates}`;
