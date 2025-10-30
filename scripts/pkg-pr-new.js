#!/usr/bin/env node

import * as cp from "node:child_process";

import { generate } from "./generate-examples";

const templateStr = generate({ writeToFile: false })
	.map((example) => `--template ${example.relativeDir}`)
	.join(" ");

cp.execSync(
	`pnpx pkg-pr-new publish './core/*' --pnpm --packageManager='pnpm' ${templateStr}`,
);
