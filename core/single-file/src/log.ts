import * as obug from "obug";

export const BASE_DEBUG_NAMESPACE = "single-file" as const;
export const DEBUG_NAMESPACES = ["error", "info", "warn"] as const;
export type DEBUG_NAMESPACE = (typeof DEBUG_NAMESPACES)[number];
export type DEBUG_SCOPE = `${typeof BASE_DEBUG_NAMESPACE}:${DEBUG_NAMESPACE}`;

export const VERBOSE_SCOPE = "info" satisfies DEBUG_NAMESPACE;

export const commonDebugOptions = {
	log: console.info,
	useColors: true,
} satisfies obug.DebugOptions;

export const debug = obug.createDebug(BASE_DEBUG_NAMESPACE, commonDebugOptions);

export const [error, info, warn] = DEBUG_NAMESPACES.map((namespace, index) => {
	const currentDebugger = obug.createDebug(BASE_DEBUG_NAMESPACE, {
		...commonDebugOptions,
		color: index + 1,
	});
	const extend = debug.extend.bind(currentDebugger);
	return extend(namespace);
});

export function enable(isVerbose: boolean) {
	const enabledScopes = DEBUG_NAMESPACES.filter((scope) => {
		return scope !== VERBOSE_SCOPE || isVerbose;
	})
		.map((scope) => `${BASE_DEBUG_NAMESPACE}:${scope}`)
		.join(",");

	obug.enable(enabledScopes);
}
