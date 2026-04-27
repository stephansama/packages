#!/usr/bin/env node

import { findRoot } from "@manypkg/find-root";
import * as cp from "node:child_process";

import { generate } from "./generate-examples.js";

const root = await findRoot(process.cwd());

const templateStr = (await generate({ writeToFile: false }))
	.map((example) => `--template ${example.relativeDir}`)
	.join(" ");

const sh = String.raw;

cp.execSync(
	sh`pnpx pkg-pr-new publish '${root.rootDir}/core/*' --pnpm --packageManager='pnpm' ${templateStr}`,
	{ stdio: "inherit" },
);
