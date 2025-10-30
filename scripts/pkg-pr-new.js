#!/usr/bin/env node

import { $ as sh } from "zx";

import { generate } from "./generate-examples.js";

const templateStr = (await generate({ writeToFile: false }))
	.map((example) => `--template ${example.relativeDir}`)
	.join(" ");

await sh`pnpx pkg-pr-new publish './core/*' --pnpm --packageManager='pnpm' ${templateStr}`;
