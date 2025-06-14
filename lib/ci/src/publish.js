#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

import root from "../../../package.json" with { type: "json" };

const { scope } = root.config;

const packages = fs.readdirSync("../../packages/");

for (const pkg of packages) {
	const packageName = [scope, pkg].join("/");
	await sh`pnpm publish -r --filter ${packageName}`;
}

await sh`pnpx pkg-pr-new publish --compact --pnpm '../../packages/*' --template '../../examples/*'`;
