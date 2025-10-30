#!/usr/bin/env node

import * as cp from "node:child_process";

import examples from "./dist/examples.json";

const templateStr = examples
	.map((example) => `--template ${example.relativeDir}`)
	.join(" ");

cp.execSync(
	`pnpx pkg-pr-new publish './core/*' --pnpm --packageManager='pnpm' ${templateStr}`,
);
