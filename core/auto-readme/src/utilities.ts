import { findRoot } from "@manypkg/find-root";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import { glob } from "tinyglobby";
import * as yaml from "yaml";

import type { Config } from "./schema";

import { ERROR, INFO } from "./log";

const sh = String.raw;

const options: { encoding: BufferEncoding } = { encoding: "utf8" };

const ignore = ["**/node_modules/**"];

const matches = [
	/.*README\.md$/gi,
	/.*Cargo\.toml$/gi,
	/.*action\.ya?ml$/gi,
	/.*package\.json$/gi,
	/.*pnpm-workspace\.yaml$/gi,
];

type BunWorkspace = { workspaces?: Workspace };
type Catalog = Record<string, string>;
type LoadedCatalogs = Awaited<ReturnType<typeof loadCatalogs>>;

type Workspace = {
	catalog: Catalog;
	catalogs: Record<string, Catalog>;
};

export async function fileExists(file: string) {
	return await fsp
		.access(file)
		.then(() => true)
		.catch(() => false);
}

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
		...matches,
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
		(item): item is string => !!item,
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

export async function getMarkdownPaths(cwd: string, config: Config) {
	const pattern = `**/${config?.onlyReadmes ? "README" : "*"}.md`;
	const readmes = await glob(pattern, { cwd, ignore });
	return readmes.map((readme) => path.resolve(cwd, readme));
}

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

export async function loadCatalogs() {
	const { rootDir } = await findRoot(process.cwd());
	const pnpmWorkspacePath = path.join(rootDir, "pnpm-workspace.yaml");

	if (fs.existsSync(pnpmWorkspacePath)) {
		const file = await fs.promises.readFile(pnpmWorkspacePath, "utf8");
		const parsed = yaml.parse(file) as Workspace;

		return {
			catalogs: parsed.catalogs,
			default: parsed.catalog,
		};
	}

	const rootJsonPath = path.join(rootDir, "package.json");
	const rootJsonFile = await fs.promises.readFile(rootJsonPath, "utf8");
	const rootPackageJson = JSON.parse(rootJsonFile) as BunWorkspace;

	return {
		catalogs: rootPackageJson?.workspaces?.catalogs,
		default: rootPackageJson?.workspaces?.catalog,
	};
}

export function resolveVersion({
	catalogs,
	name,
	version,
}: {
	catalogs?: LoadedCatalogs;
	name: string;
	version: string;
}) {
	if (!version.startsWith("catalog:")) return version;

	if (!version.endsWith(":")) {
		const catalogName = version.split(":").at(-1);
		const pulled =
			catalogs?.catalogs?.[
				catalogName as keyof typeof catalogs.catalogs
			]?.[name];
		if (pulled) return pulled;
	}

	const defaultVersion = catalogs?.default?.[name];
	if (defaultVersion) return defaultVersion;

	return version;
}

function findNearestReadme(
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
