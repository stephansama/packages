import type { PackageJSON } from "@manypkg/tools";

import { getPackages } from "@manypkg/get-packages";
import * as pkg from "empathic/package";
import * as fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { glob } from "tinyglobby";

import type { RuleMap } from "@/rules";
import type { ConfigSchema } from "@/schema";
import type { DirtyFile, Error as RuleError } from "@/type";

import { info } from "@/log";
import { parse } from "@/parse";
import { DEFAULT_IGNORE_LIST } from "@/paths";

export async function checkRules(
	config: Omit<ConfigSchema, "rules"> & { rules: RuleMap },
) {
	const cwd = process.cwd();
	const { packages, rootDir, rootPackage } = await getPackages(cwd);

	if (!rootPackage) throw new Error("unable to find root package");

	const checkedErrors = new Array<RuleError>();

	const dirtyFiles = await Promise.all(
		Object.values(config.rules)
			.filter((rule) => rule.enabled)
			.map(async (rule) => {
				const fileMatches = await glob(rule.pattern, {
					cwd,
					ignore:
						config.ignorePaths.length > 0
							? config.ignorePaths
							: DEFAULT_IGNORE_LIST,
				});

				info(`loading rules for ${rule.name}`);

				const lintMatches = await Promise.all(
					fileMatches.map(async (match) => {
						const raw = await fs.promises.readFile(match, "utf8");
						const parsed = parse(raw, rule.parse);

						const closestPackagePath = pkg.up({
							cwd: path.dirname(match || process.cwd()),
							last: rootDir,
						});

						const closestPackageFile = closestPackagePath
							? await fs.promises.readFile(
									closestPackagePath,
									"utf8",
								)
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
								absolutePath: path.join(
									pkg.dir,
									"package.json",
								),
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

						checkedErrors.push(...errors);

						return context;
					}),
				);

				return lintMatches;
			}),
	);

	const width = Math.max(
		...checkedErrors.map((error) => ` ${error.id}: `.length),
	);

	console.info(
		checkedErrors
			.map((error) => {
				return (
					pc.bold(` ${error.id}: `.padEnd(width)) + `${error.message}`
				);
			})
			.join("\n"),
	);

	return dirtyFiles.flat().filter((match): match is DirtyFile => !!match);
}
