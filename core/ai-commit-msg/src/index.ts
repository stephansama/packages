#!/usr/bin/env node

import dotenvx from "@dotenvx/dotenvx";
import { generateText } from "ai";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";

import { getProvider } from "./ai";
import { parseArgs } from "./args";
import { loadConfig } from "./config";

export async function run() {
	dotenvx.config();

	const args = await parseArgs();

	if (!args.output) args.output = getCommitEditMsg();

	const config = await loadConfig();

	const providerResult = getProvider(config.provider, config.model);

	if (providerResult.isErr()) {
		console.error(providerResult.error.message);
		process.exit(1);
	}

	const model = providerResult.value;

	const { text } = await generateText({
		model,
		prompt: `generate a conventional commit message based on the following diff. the subject should be all lowercase. and lines should not exceed 100 characters \n\n${getDiff()}`,
	});

	await fsp.writeFile(args.output, text);
}

const sh = String.raw;

function getCommitEditMsg() {
	const output = cp.execSync(sh`git rev-parse --git-path COMMIT_EDITMSG`, {
		encoding: "utf8",
	});

	if (output) return output.substring(0, 8000).trim();

	throw new Error(
		"unable to find commit edit msg. please use within a git directory or provide the output flag -o",
	);
}

function getDiff() {
	const output = cp.execSync(sh`git --no-pager diff --staged`, {
		encoding: "utf8",
	});

	if (output) return output.substring(0, 8000).trim();
}
