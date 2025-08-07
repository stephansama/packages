import glob from "fast-glob";
import cp from "node:child_process";
import * as path from "node:path";

import type { Config } from "./config";

const sh = String.raw;

const ignore = ["**/node_modules/**"];

export function getGitRoot() {
	const opts: { encoding: BufferEncoding } = { encoding: "utf8" };
	return cp.execSync(sh`git rev-parse --show-toplevel`, opts).trim();
}

export async function getMarkdownPaths(cwd: string, config: Config) {
	const pattern = `**/${config?.onlyReadmes ? "README" : "*"}.md`;
	const readmes = await glob(pattern, { cwd, ignore });
	return readmes.map((readme) => path.resolve(cwd, readme));
}
