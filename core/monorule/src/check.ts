import * as fs from "node:fs";
import path from "node:path";
import { glob } from "tinyglobby";

import type { RuleMap } from "./rule";
import type { DirtyFile } from "./type";

import { parse } from "./parse";

export async function checkRules(rules: RuleMap) {
	const dirtyFiles = await Promise.all(
		Object.values(rules).map(async (rule) => {
			const cwd = process.cwd();
			const fileMatches = await glob(rule.pattern, { cwd });

			console.info(`loading rules for ${rule.name}`);

			const lintMatches = await Promise.all(
				fileMatches.map(async (match) => {
					const raw = await fs.promises.readFile(match, "utf8");
					const parsed = parse(raw, rule.parse);
					// @ts-expect-error works
					if (!rule.when(parsed)) return false;

					console.info(
						`found issue with ${match} in rule ${rule.name}`,
					);

					return {
						absolutePath: path.resolve(process.cwd(), match),
						content: parsed,
						raw,
						relativePath: match,
						rule: rule.name,
					} satisfies DirtyFile;
				}),
			);

			return lintMatches.filter((match): match is DirtyFile => !!match);
		}),
	);

	return dirtyFiles.flat();
}
