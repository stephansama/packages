import * as dotenvx from "@dotenvx/dotenvx";
import { generateText } from "ai";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";

import { getProvider } from "./ai";
import { parseArguments } from "./arguments";
import { loadConfig } from "./config";
import { defaultPrompt } from "./schema";

export async function run() {
	dotenvx.config();

	const parsed = await parseArguments();

	if (!parsed.output) parsed.output = getCommitEditMessageFile();

	const config = await loadConfig();

	if (config.skipNextRun) {
		console.warn("skipNextRun flag supplied skipping current run");
		return;
	}

	const providerResult = getProvider(config.provider, config.model);

	if (providerResult.isErr()) {
		throw new Error(providerResult.error.message);
	}

	const model = providerResult.value;

	const diff = getDiff();

	if (!diff) throw new Error("unable to get git diff");

	const prompt = config.prompt || defaultPrompt;

	const { text } = await generateText({
		model,
		prompt: prompt.replace("{{diff}}", diff),
	});

	await fsp.writeFile(parsed.output, text);
}

function getCommitEditMessageFile() {
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

	if (output) return output.slice(0, 8000).trim();
}
