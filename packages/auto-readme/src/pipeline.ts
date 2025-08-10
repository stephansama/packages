import { remark } from "remark";
import remarkToc from "remark-toc";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { INFO } from "./log";
import { autoReadmeRemarkPlugin } from "./plugin";

export async function parse(file: string, config: Config, data: ActionData) {
	const pipeline = remark().use(autoReadmeRemarkPlugin, config, data);

	if (config.useToc) {
		INFO("generating table of contents");
		pipeline.use(remarkToc, { heading: "contents" });
	}

	const vfile = await pipeline.process(file);
	return vfile.toString();
}
