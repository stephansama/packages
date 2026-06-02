import type { PackageJSON } from "@manypkg/tools";

import { getPackages } from "@manypkg/get-packages";
import * as pkg from "empathic/package";
import * as fs from "node:fs";
import path from "node:path";
import { glob } from "tinyglobby";

import type { RuleMap } from "./rule";
import type { DirtyFile } from "./type";

import { parse } from "./parse";

export async function checkRules(rules: RuleMap) {
	const { packages, rootDir, rootPackage } = await getPackages(process.cwd());

	if (!rootPackage) throw new Error("unable to find root package");

	const dirtyFiles = await Promise.all(
		Object.values(rules).map(async (rule) => {
			const cwd = process.cwd();
			const fileMatches = await glob(rule.pattern, { cwd });

			console.info(`loading rules for ${rule.name}`);

			const lintMatches = await Promise.all(
				fileMatches.map(async (match) => {
					const raw = await fs.promises.readFile(match, "utf8");
					const parsed = parse(raw, rule.parse);

					const closestPackagePath = pkg.up({
						cwd: path.dirname(match || process.cwd()),
						last: rootDir,
					});

					const closestPackageFile = closestPackagePath
						? await fs.promises.readFile(closestPackagePath, "utf8")
						: undefined;

					const closestPackageJson = closestPackageFile
						? (JSON.parse(closestPackageFile) as PackageJSON)
						: undefined;

					const context = {
						absolutePath: path.resolve(process.cwd(), match),
						closestPackage: {
							absolutePath: closestPackagePath,
							json: closestPackageJson,
							relativePath: closestPackagePath
								? path.relative(rootDir, closestPackagePath)
								: undefined,
						},
						content: parsed,
						packages: packages.map((pkg) => ({
							absolutePath: path.join(pkg.dir, "package.json"),
							json: pkg.packageJson,
							relativePath: path.join(
								pkg.relativeDir,
								"package.json",
							),
						})),
						raw,
						relativePath: match,
						rootPackage: {
							absolutePath: path.join(
								rootPackage.dir,
								"package.json",
							),
							json: rootPackage?.packageJson || {},
						},
						rule: rule.name,
					} as const satisfies DirtyFile;

					// @ts-expect-error works
					const errors = rule.when(parsed, context);
					if (!errors || errors.length === 0) return false;

					console.info(
						errors
							.map((error) => {
								return `${error.id ? error.id + ": " : ""}${error.message}`;
							})
							.join("\n"),
					);

					return context;
				}),
			);

			return lintMatches;
		}),
	);

	return dirtyFiles.flat().filter((match): match is DirtyFile => !!match);
}
