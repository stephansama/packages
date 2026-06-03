import * as obug from "obug";

import pkg from "@/package.json";

export const DEBUG_BASE_NAMESPACE = pkg.name.replace(
	"@stephansama/",
	"",
) as `monorule`;
export const DEBUG_NAMESPACES = ["error", "info", "warn"] as const;
export type DEBUG_NAMESPACE = (typeof DEBUG_NAMESPACES)[number];
export type DEBUG_SCOPE = `${typeof DEBUG_BASE_NAMESPACE}:${DEBUG_NAMESPACE}`;

export const VERBOSE_SCOPE = "info" satisfies DEBUG_NAMESPACE;

export const commonDebugOptions = {
	log: console.info,
	useColors: true,
} satisfies obug.DebugOptions;

export const debug = obug.createDebug(DEBUG_BASE_NAMESPACE, commonDebugOptions);

export const [error, info, warn] = DEBUG_NAMESPACES.map((namespace, index) => {
	debug.color = index + 1;
	return debug.extend(namespace);
});

export function enable(verbosity: number | undefined) {
	const enabledScopes = DEBUG_NAMESPACES.filter((_, index) => {
		return index <= (verbosity || 0);
	})
		.map((scope) => `${DEBUG_BASE_NAMESPACE}:${scope}`)
		.join(",");

	obug.enable(enabledScopes);
}
