import { fromMarkdown } from "mdast-util-from-markdown";
import * as fsp from "node:fs/promises";

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
	await Promise.all(
		paths.map(async (path) => {
			const file = await fsp.readFile(path, { encoding: "utf8" });
			const ast = fromMarkdown(file);
			const actions = loadAstComments(ast);

			if (!actions.length) return;

			const data = await loadActionData(actions, path, root);
			const content = await parse(file, config, data);
			await fsp.writeFile(path, content);
		}),
	);
}
