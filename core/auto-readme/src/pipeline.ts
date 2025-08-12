import * as path from "node:path";
import { remark } from "remark";
import remarkCodeImport from "remark-code-import";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import remarkUsage from "remark-usage";
import { VFile } from "vfile";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { createFindParameter } from "./data";
import { INFO, WARN } from "./log";
import { autoReadmeRemarkPlugin } from "./plugin";
import { fileExists } from "./utils";

export async function parse(
	file: string,
	filepath: string,
	root: string,
	config: Config,
	data: ActionData,
) {
	const pipeline = remark()
		.use(autoReadmeRemarkPlugin, config, data)
		.use(remarkCodeImport, {});

	const usage = data.find((d) => d.action === "USAGE");

	if (usage?.action === "USAGE" || config.enableUsage) {
		const find = createFindParameter(usage?.parameters || []);
		const examplePath = find("path");
		const dirname = path.dirname(filepath);
		const resolvePath = examplePath && path.resolve(dirname, examplePath);
		const relativeProjectPath =
			config.usageFile &&
			path.relative(root, path.resolve(dirname, config.usageFile));
		const example =
			(examplePath && resolvePath && path.relative(root, resolvePath)) ||
			relativeProjectPath ||
			undefined;

		if (example && (await fileExists(example))) {
			INFO("generating usage section");
			pipeline.use(remarkUsage, {
				example,
				heading: config.usageHeading,
			});
		} else {
			WARN("not able to find example file for readme", filepath, example);
		}
	}

	if (config.enableToc) {
		INFO("generating table of contents section");
		pipeline.use(remarkToc, { heading: config.tocHeading });
	}

	if (config.enableToc || config.collapseHeadings?.length) {
		const additional = config.collapseHeadings?.length
			? config.collapseHeadings
			: [];
		const headings = [...additional, config.tocHeading];
		pipeline.use(remarkCollapse, {
			test: {
				ignoreFinalDefinitions: true,
				test: (value, _) => {
					return headings.some((i) => value.trim() === i?.trim());
				},
			},
		});
	}

	const vfile = new VFile({ path: path.resolve(filepath), value: file });
	const markdown = await pipeline.process(vfile);
	return markdown.toString();
}
