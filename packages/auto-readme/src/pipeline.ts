import { remark } from "remark";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { autoReadmeRemarkPlugin } from "./plugin";

export async function parse(file: string, config: Config, data: ActionData) {
	const vfile = await remark()
		.use(autoReadmeRemarkPlugin, config, data)
		.process(file);
	return vfile.toString();
}
