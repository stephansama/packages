#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

const scope = "@stephansama";

const packages = fs.readdirSync("../../packages/");

console.log(process.env.NODE_AUTH_TOKEN);

for (const pkg of packages) {
	const packageName = [scope, pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}
