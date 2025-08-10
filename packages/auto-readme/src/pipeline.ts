import { remark } from "remark";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { INFO } from "./log";
import { autoReadmeRemarkPlugin } from "./plugin";

export async function parse(file: string, config: Config, data: ActionData) {
	const pipeline = remark().use(autoReadmeRemarkPlugin, config, data);
	const heading = "Table of contents";

	if (config.useToc) {
		INFO("generating table of contents");
		pipeline
			.use(remarkToc, { heading })
			.use(remarkCollapse, { test: heading });
	}

	const vfile = await pipeline.process(file);
	return vfile.toString();
}
