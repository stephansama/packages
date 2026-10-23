import * as cp from "node:child_process";
import path from "node:path";

import type { Config } from "../schema";

import { ERROR, INFO } from "../log";
import { AFFECTED_FILE_MATCHES } from "./constants";
import { findNearestReadme, isIgnored } from "./files";

const sh = String.raw;

const options: { encoding: BufferEncoding } = { encoding: "utf8" };

/** Readmes affected by the currently staged files plus the root readme */
export function findAffectedMarkdowns(root: string, config: Config) {
	const affected = cp
		/* cspell:disable-next-line because of the filter */
		.execSync(sh`git diff --cached --name-only --diff-filter=MACT`, options)
		.trim()
		.split("\n")
		.filter((item): item is string => !!item);

	if (affected.length === 0) ERROR("no staged files found");

	if (config.affectedRegexes?.length) {
		INFO("adding the following expressions: ", config.affectedRegexes);
	}

	const allMatches = [
		...AFFECTED_FILE_MATCHES,
		...(config.affectedRegexes?.map((r) => new RegExp(r)) || []),
	];

	INFO("Checking affected files against regexes", affected, allMatches);

	const eligible = affected.filter((a) => allMatches.some((m) => a.match(m)));

	INFO("Found the following eligible affected files", eligible);

	const md = eligible.map((current) => {
		return findNearestReadme(root, path.resolve(current));
	});

	const rootMd = path.join(root, "README.md");

	const dedupe = [...new Set(md), rootMd].filter(
		(item): item is string => !!item && !isIgnored(root, item, config),
	);

	INFO("Found the following readmes", dedupe);

	return dedupe;
}

export function getGitRoot() {
	const root = cp.execSync(sh`git rev-parse --show-toplevel`, options).trim();

	if (!root) {
		throw new Error("must be ran within a git directory.");
	}

	INFO("found git root at location: ", root);

	return root;
}
