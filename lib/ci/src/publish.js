#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

import root from "../../../package.json" with { type: "json" };

const { scope } = root.config;

const packages = fs.readdirSync("../../packages/");

for (const pkg of packages) {
	const packageName = [scope, pkg].join("/");
	await sh`pnpm publish --filter ${packageName}`;
}

await sh`../../node_modules/.bin/pkg-pr-new publish --packageManager="pnpm" --pnpm '../../packages/*' --template '../../examples/*'`;
