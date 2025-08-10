import * as path from "node:path";
import { remark } from "remark";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import remarkUsage from "remark-usage";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { createFindParameter } from "./data";
import { INFO } from "./log";
import { autoReadmeRemarkPlugin } from "./plugin";

export async function parse(
	file: string,
	filepath: string,
	root: string,
	config: Config,
	data: ActionData,
) {
	const pipeline = remark().use(autoReadmeRemarkPlugin, config, data);
	const usage = data.find((d) => d.action === "USAGE");

	if (usage?.action === "USAGE" || config.enableUsage) {
		const find = createFindParameter(usage?.parameters || []);
		const examplePath = find("path");
		const resolvePath =
			examplePath && path.resolve(path.dirname(filepath), examplePath);
		const example =
			(examplePath && resolvePath && path.relative(root, resolvePath)) ||
			config.usageFile ||
			undefined;

		INFO("generating usage section");
		pipeline.use(remarkUsage, { example, heading: config.usageHeading });
	}

	if (config.useToc) {
		INFO("generating table of contents section");
		pipeline
			.use(remarkToc, { heading: config.tocHeading })
			.use(remarkCollapse, { test: config.tocHeading });
	}

	const vfile = await pipeline.process(file);
	return vfile.toString();
}
