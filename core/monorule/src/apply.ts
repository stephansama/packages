import * as fs from "node:fs";

import type { RuleMap } from "@/rules";
import type { DirtyFile, Error } from "@/type";

import { info } from "@/log";
import { stringify } from "@/parse";

export async function applyRules(
	dirtyFiles: (DirtyFile & { errors: Array<Error> })[],
	rules: RuleMap,
) {
	await Promise.all(
		dirtyFiles.map(async (file) => {
			info(`applying ${file.rule} to ${file.relativePath}`);

			const currentRule = rules[file.rule];
			if (!currentRule.apply) return;

			const resolved = await currentRule.apply(
				file.content as object | string,
				file,
			);
			if (!resolved) return;

			info(`stringifying ${currentRule.name} for ${file.absolutePath}`);

			const format =
				typeof currentRule.parse === "function"
					? "json"
					: currentRule.parse;
			const formatted = await (currentRule.stringify
				? currentRule.stringify(resolved)
				: stringify(resolved, format));

			await fs.promises.writeFile(file.absolutePath, formatted, "utf8");

			info(
				`applied lint rule ${currentRule.name} to ${file.absolutePath}`,
			);
		}),
	);
}
