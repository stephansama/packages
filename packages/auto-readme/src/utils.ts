import glob from "fast-glob";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import type { Config } from "./schema";

import { ERROR, INFO } from "./log";

const sh = String.raw;

const opts: { encoding: BufferEncoding } = { encoding: "utf8" };

const ignore = ["**/node_modules/**"];

const matches = [
	/.*README\.md$/gi,
	/.*Cargo\.toml$/gi,
	/.*action\.ya?ml$/gi,
	/.*package\.json$/gi,
	/.*pnpm-workspace\.yaml$/gi,
];

export async function fileExists(file: string) {
	try {
		await fsp.access(file);
		return true;
	} catch {
		return false;
	}
}

export function findAffectedMarkdowns(config: Config) {
	const affected = cp
		/* cspell:disable-next-line because of the filter */
		.execSync(sh`git diff --cached --name-only --diff-filter=MACT`, opts)
		.trim()
		.split("\n")
		.filter(Boolean);

	if (!affected.length) ERROR("no staged files found");

	if (config.affectedRegexes?.length) {
		INFO("adding the following expressions: ", config.affectedRegexes);
	}

	const allMatches = [
		...matches,
		...(config.affectedRegexes?.map((r) => new RegExp(r)) || []),
	];

	INFO("Checking affected files against regexes", affected, allMatches);

	const eligible = affected
		.filter((a) => allMatches.some((m) => a.match(m)))
		.map((file) => path.resolve(path.dirname(file), "README.md"))
		.filter((readme) => fs.existsSync(readme));

	return eligible;
}

export function getGitRoot() {
	const root = cp.execSync(sh`git rev-parse --show-toplevel`, opts).trim();

	if (!root) {
		throw new Error("must be ran within a git directory.");
	}

	INFO("found git root at location: ", root);

	return root;
}

export async function getMarkdownPaths(cwd: string, config: Config) {
	const pattern = `**/${config?.onlyReadmes ? "README" : "*"}.md`;
	const readmes = await glob(pattern, { cwd, ignore });
	return readmes.map((readme) => path.resolve(cwd, readme));
}
