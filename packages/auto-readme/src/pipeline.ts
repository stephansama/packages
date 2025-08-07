import { remark } from "remark";

import type { Config } from "./config";

import { myPluginThatReplacesFoo } from "./plugin";

export async function parse(file: string, context: Config) {
	return await remark().use(myPluginThatReplacesFoo).process(file);
}
