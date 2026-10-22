import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import { glob } from "tinyglobby";

import type { Config } from "../schema";

import { IGNORED_GLOBS } from "./constants";

export async function fileExists(file: string) {
	return await fsp
		.access(file)
		.then(() => true)
		.catch(() => false);
}

/** Walk up from a file until a `README.md` is found or the git root is hit */
export function findNearestReadme(
	gitRoot: string,
	inputFile: string,
	maxRotations = 15,
) {
	let dirname = path.dirname(inputFile);
	let rotations = 0;

	while (true) {
		const option = path.join(dirname, "README.md");

		if (fs.existsSync(option)) return option;

		const parent = path.dirname(dirname);

		if (
			parent === dirname ||
			dirname === gitRoot ||
			++rotations > maxRotations
		) {
			break;
		}

		dirname = parent;
	}
}

export async function getMarkdownPaths(cwd: string, config: Config) {
	const pattern = `**/${config?.onlyReadmes ? "README" : "*"}.md`;
	const readmes = await glob(pattern, { cwd, ignore: IGNORED_GLOBS });
	return readmes.map((readme) => path.resolve(cwd, readme));
}

/** Resolve symbolic links so prettier formats the real file */
export async function getPrettierPaths(paths: string[]) {
	return await Promise.all(
		paths.map(async (file) => {
			const stats = await fsp.lstat(file);
			const isSymbolicLink = stats.isSymbolicLink();
			if (!isSymbolicLink) return file;
			const symlink = await fsp.readlink(file);
			return path.join(path.dirname(file), symlink);
		}),
	);
}
