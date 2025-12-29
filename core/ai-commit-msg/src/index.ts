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

	if (!args.output) throw new Error("need to supply output path");

	const config = await loadConfig();

	const model = getProvider(config.provider, config.model).unwrapOr("ollama");

	const { text } = await generateText({
		model,
		prompt: `generate a conventional commit message based on the following diff. the subject should be all lowecase. and lines should not exceed 100 characters \n\n${getDiff()}`,
	});

	await fsp.writeFile(args.output, text);
}

function getDiff() {
	const output = cp.execSync(`git --no-pager diff --staged`, {
		encoding: "utf8",
	});

	if (output) return output.substring(0, 8000).trim();
}
