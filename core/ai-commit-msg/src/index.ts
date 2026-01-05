#!/usr/bin/env node

import dotenvx from "@dotenvx/dotenvx";
import { generateText } from "ai";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";

import { getProvider } from "./ai";
import { parseArgs } from "./args";
import { loadConfig } from "./config";
import { defaultPrompt } from "./schema";

export async function run() {
	dotenvx.config();

	const args = await parseArgs();

	if (!args.output) args.output = getCommitEditMsgFile();

	const config = await loadConfig();

	if (config.skipNextRun) {
		console.warn("skipNextRun flag supplied skipping current run");
		return process.exit(0);
	}

	const providerResult = getProvider(config.provider, config.model);

	if (providerResult.isErr()) {
		console.error(providerResult.error.message);
		return process.exit(1);
	}

	const model = providerResult.value;

	const diff = getDiff();

	if (!diff) throw new Error("unable to get git diff");

	const prompt = config.prompt || defaultPrompt;

	const { text } = await generateText({
		model,
		prompt: prompt.replace("{{diff}}", diff),
	});

	await fsp.writeFile(args.output, text);
}

function getCommitEditMsgFile() {
	const output = cp.execSync(`git rev-parse --git-path COMMIT_EDITMSG`, {
		encoding: "utf8",
	});

	if (output) return output.trim();

	throw new Error(
		"unable to find commit edit msg. please use within a git directory or provide the output flag -o",
	);
}

function getDiff() {
	const output = cp.execSync(`git --no-pager diff --staged`, {
		encoding: "utf8",
	});

	if (output) return output.substring(0, 8000).trim();
}
