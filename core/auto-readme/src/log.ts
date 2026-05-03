import { createDebug } from "obug";

const debug = createDebug("autoreadme", {
	useColors: true,
});

export const ERROR = debug.extend("error");
export const INFO = debug.extend("info");
export const WARN = debug.extend("warn");
