import { createDebug } from "obug";

import { moduleName } from "./util";

export const debug = createDebug(namespace("debug"));
export const info = createDebug(namespace("info"));
export const warn = createDebug(namespace("warn"));

function namespace(space: string) {
	return [moduleName, space].join(":");
}
