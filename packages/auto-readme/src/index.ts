import { fromMarkdown } from "mdast-util-from-markdown";
import * as fsp from "node:fs/promises";
import ora from "ora";

import { parseArgs } from "./args";
import { loadAstComments } from "./comment";
import { loadConfig } from "./config";
import { loadActionData } from "./data";
import { ERROR, INFO } from "./log";
import { parse } from "./pipeline";
import { findAffectedMarkdowns, getGitRoot, getMarkdownPaths } from "./utils";

export async function run() {
	const args = await parseArgs();
	const config = (await loadConfig(args)) || {};

	INFO("Loaded the following configuration:", config);

	const root = getGitRoot();

	INFO("Found git root at " + root);

	const isAffected = args.changes ? "affected" : "";

	INFO(`Loading ${!isAffected ? "all " : "affected "}files`);

	const paths = isAffected
		? findAffectedMarkdowns()
		: await getMarkdownPaths(root, config);

	INFO("Loaded the following files:", paths.join("\n"));

	const type = args.onlyReadmes ? "readmes" : "markdown files";

	if (!paths.length) {
		return ERROR(`no ${isAffected} readmes found to update`);
	}

	const spinner = ora(`Updating ${type}`).start();

	await Promise.all(
		paths.map(async (path) => {
			const file = await fsp.readFile(path, { encoding: "utf8" });
			// get rid of ast via garbage collector faster
			const actions = (() => {
				const ast = fromMarkdown(file);
				return loadAstComments(ast);
			})();

			if (!actions.length) return;

			const data = await loadActionData(actions, path, root);
			INFO("Loaded comment action data", data);
			const content = await parse(file, config, data);
			await fsp.writeFile(path, content);
		}),
	);

	spinner.stop();
}
