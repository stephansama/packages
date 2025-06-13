#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

const packages = fs.readdirSync("../../packages/");

for (const pkg of packages) {
	const packageName = ["@stephansama", pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}

await sh`../../node_modules/.bin/pkg-pr-new publish --packageManager="pnpm" --pnpm '../../packages/*' --template '../../examples/*'`;
