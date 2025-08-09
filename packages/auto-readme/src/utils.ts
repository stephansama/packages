import glob from "fast-glob";
import cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

import type { Config } from "./schema";

const sh = String.raw;

const opts: { encoding: BufferEncoding } = { encoding: "utf8" };

const ignore = ["**/node_modules/**"];

const matches = [
	/.*action.ya?ml$/gi,
	/.*package.json$/gi,
	/.*pnpm-workspace.yaml$/gi,
];

export function findAffectedMarkdowns() {
	const affected = cp
		/* cspell:disable-next-line because of the filter */
		.execSync(sh`git diff --cached --name-only --diff-filter=MACT`, opts)
		.trim()
		.split("\n");

	const eligible = affected
		.filter((a) => matches.some((m) => a.match(m)))
		.map((file) => path.resolve(path.dirname(file), "README.md"))
		.filter((readme) => fs.existsSync(readme));

	return eligible;
}

export function getGitRoot() {
	return cp.execSync(sh`git rev-parse --show-toplevel`, opts).trim();
}

export async function getMarkdownPaths(cwd: string, config: Config) {
	const pattern = `**/${config?.onlyReadmes ? "README" : "*"}.md`;
	const readmes = await glob(pattern, { cwd, ignore });
	return readmes.map((readme) => path.resolve(cwd, readme));
}
