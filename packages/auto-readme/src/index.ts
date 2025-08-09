import { fromMarkdown } from "mdast-util-from-markdown";
import * as fsp from "node:fs/promises";
import ora from "ora";

import { parseArgs } from "./args";
import { loadAstComments } from "./comment";
import { loadConfig } from "./config";
import { loadActionData } from "./data";
import { parse } from "./pipeline";
import { getGitRoot, getMarkdownPaths } from "./utils";

export async function run() {
	const args = await parseArgs();
	const config = (await loadConfig(args)) || {};
	const root = getGitRoot();
	const paths = await getMarkdownPaths(root, config);
	const type = args.onlyReadmes ? "readmes" : "markdown files";
	const spinner = ora(`Updating ${type}`).start();
	await Promise.all(
		paths.map(async (path, i) => {
			const file = await fsp.readFile(path, { encoding: "utf8" });
			// get rid of ast via garbage collector faster
			const actions = (() => {
				const ast = fromMarkdown(file);
				return loadAstComments(ast);
			})();

			if (!actions.length) return;

			const data = await loadActionData(actions, path, root);
			const content = await parse(file, config, data);
			await fsp.writeFile(path, content);
		}),
	);
	spinner.stop();
}
