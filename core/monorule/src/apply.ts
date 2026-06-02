import * as fs from "node:fs";

import type { RuleMap } from "./rule";
import type { DirtyFile } from "./type";

import { stringify } from "./parse";

export async function applyRules(dirtyFiles: DirtyFile[], rules: RuleMap) {
	await Promise.all(
		dirtyFiles.map(async (file) => {
			console.log(`applying ${file.rule} to ${file.relativePath}`);

			const currentRule = rules[file.rule];
			if (currentRule.apply) {
				const result = currentRule.apply(
					file.content as object | string,
				);

				if (result instanceof Promise) {
					console.info(
						`stringifying ${currentRule.name} for ${file.absolutePath}`,
					);
					const string_ = stringify(
						await result,
						typeof currentRule.parse === "function"
							? "json"
							: currentRule.parse,
					);

					await fs.promises.writeFile(
						file.absolutePath,
						string_,
						"utf8",
					);

					console.info(
						`applied lint rule ${currentRule.name} to ${file.absolutePath}`,
					);

					return;
				}

				console.info(
					`stringifying ${currentRule.name} for ${file.absolutePath}`,
				);

				const string_ = stringify(
					result,
					typeof currentRule.parse === "function"
						? "json"
						: currentRule.parse,
				);

				await fs.promises.writeFile(file.absolutePath, string_, "utf8");

				console.info(
					`applied lint rule ${currentRule.name} to ${file.absolutePath}`,
				);
			}
		}),
	);
	console.info({ dirty: dirtyFiles });
	console.info(rules);
}
