import { fromMarkdown } from "mdast-util-from-markdown";
import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
import { Spinner } from "picospinner";

import type { Config } from "./schema";

import { parseArguments } from "./arguments";
import { loadAstComments } from "./comment";
import { loadConfig } from "./config";
import { loadActionData } from "./data";
import { ERROR, INFO, WARN } from "./log";
import { parse } from "./pipeline";
import {
	findAffectedMarkdowns,
	getGitRoot,
	getMarkdownPaths,
	getPrettierPaths,
} from "./utilities";

export async function run() {
	const arguments_ = await parseArguments();
	const config: Config = (await loadConfig(arguments_)) || {};

	INFO("Loaded the following configuration:", config);

	const root = getGitRoot();

	const isAffected = arguments_.changes && "affected";

	INFO(`Loading ${isAffected ? "affected " : "all "}files`);

	const paths = isAffected
		? findAffectedMarkdowns(root, config)
		: await getMarkdownPaths(root, config);

	INFO("Loaded the following files:", paths.join("\n"));

	if (paths.length === 0) {
		return ERROR(`no ${isAffected} readmes found to update`);
	}

	const spinner = !arguments_.verbose && makeSpinner();
	if (spinner) spinner.start();

	await Promise.all(
		paths
			.filter((path): path is string => !!path)
			.map(async (path) => {
				const file = await fsp.readFile(path, { encoding: "utf8" });
				// get rid of ast via garbage collector faster
				const actions = (() => {
					const ast = fromMarkdown(file);
					return loadAstComments(ast);
				})();

				if (actions.length === 0) {
					WARN(`no action comments found in`, path);
					if (!config.enableUsage || !config.enableToc) {
						return ERROR("no action or plugins found");
					} else {
						INFO("plugins enabled. continuing parsing", path);
					}
				}

				const data = await loadActionData(actions, path, root);

				INFO("Loaded comment action data", data);

				const content = await parse(file, path, root, config, data);
				await fsp.writeFile(path, content);
			}),
	);

	const options = { stdio: "inherit" } satisfies cp.CommonExecOptions;

	if (config.enablePrettier) {
		INFO("formatting with prettier");

		const prettierPaths = await getPrettierPaths(paths);
		cp.execFileSync("prettier", ["--write", ...prettierPaths], options);
	}

	if (isAffected) {
		INFO("adding affected files to git stage");

		cp.execFileSync("git", ["add", ...paths], options);
	}

	if (spinner) spinner.stop();
}

function makeSpinner() {
	return new Spinner("Updating readme...", { colors: { spinner: "red" } });
}
