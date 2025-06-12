#!/usr/bin/env node

import fs from "node:fs";

const scope = "@stephansama";

const packages = fs.readdirSync("../../packages/");

for (const pkg of packages) {
	const packageName = [scope, pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}
