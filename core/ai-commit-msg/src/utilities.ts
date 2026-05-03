import { createDebug } from "obug";

import pkg from "../package.json";

export const moduleName = pkg.name.split("/").at(-1)!.replaceAll("-", "");

export const debug = createDebug(namespace("debug"));
export const info = createDebug(namespace("info"));
export const warn = createDebug(namespace("warn"));

function namespace(space: string) {
	return [moduleName, space].join(":");
}
