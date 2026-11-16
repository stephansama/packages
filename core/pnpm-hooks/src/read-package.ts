import type { BaseManifest } from "@pnpm/types";

import type { ReadPackageHook } from "./types";

/** An exact semver version, optionally prefixed with `v` (https://semver.org) */
const exactVersionRegex =
	/^v?(?<version>(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)$/i;

/**
 * Range operators whose lower bound is the version they prefix. `>` and `<=`
 * aren't here: their lower bound isn't the version written.
 */
const lowerBoundOperatorRegex = /^(?:\^|~>?|>=|=)\s*/;

/** `npm:<name>@<range>` aliases, where `<name>` may be scoped */
const npmAliasRegex = /^(?<prefix>npm:(?:@[^@/]+\/)?[^@]+@)(?<range>.+)$/;

/** `<from> - <to>` hyphen ranges, not part of an `||` union */
const hyphenRangeRegex = /^(?<from>[^\s|]+)\s+-\s+[^\s|]+$/;

/** `*`, `x`, `X` and empty specs match any version */
function isWildcard(version: string) {
	return ["", "*", "x", "X"].includes(version.trim());
}

/**
 * Pin a version range to its lower bound, so `^1.2.3`, `~1.2.3`, `>=1.2.3` and
 * the hyphen range `1.2.3 - 2.0.0` all become `1.2.3`.
 *
 * Anything without one exact lower bound (`||`, x-ranges like `1.x`, partial
 * versions like `^1.2`, `>`, `<`, `*`, dist-tags) is left as written, as are
 * protocols such as `workspace:`, `catalog:`, `file:` and git urls: rewriting
 * those would change what they resolve to instead of pinning them.
 */
function pinVersion(version: string): string {
	const trimmed = version.trim();

	const alias = npmAliasRegex.exec(trimmed)?.groups;
	if (alias?.prefix && alias.range) {
		return `${alias.prefix}${pinVersion(alias.range)}`;
	}

	const from = hyphenRangeRegex.exec(trimmed)?.groups?.from;
	const lowerBound = from ?? trimmed.replace(lowerBoundOperatorRegex, "");

	return toExactVersion(lowerBound) ?? trimmed;
}

function toExactVersion(range: string) {
	return exactVersionRegex.exec(range)?.groups?.version;
}

const dependencyTypes = [
	"dependencies",
	"devDependencies",
	"optionalDependencies",
] as const satisfies Array<
	keyof Pick<
		BaseManifest,
		"dependencies" | "devDependencies" | "optionalDependencies"
	>
>;

export type PinAllDependenciesOptions = {
	/**
	 * Versions to use for wildcard specs (`*`, `x` or empty), keyed by
	 * dependency name. A wildcard has no lower bound, so without a fallback
	 * it's left unchanged. Use exact versions: fallbacks are used as written.
	 *
	 * @example
	 * 	{ "@types/node": "24.12.2", "@types/unist": "3.0.3" }
	 */
	fallbacks?: Partial<Record<string, string>>;
};

/**
 * Create a `readPackage` hook that pins all dependencies in a pnpm workspace
 * (including nested dependencies), using `fallbacks` for wildcard specs.
 */
export function createPinAllDependencies({
	fallbacks = {},
}: PinAllDependenciesOptions = {}) {
	return ((pkg, _context) => {
		for (const current of dependencyTypes) {
			const dependencies = pkg[current];
			if (!dependencies) continue;

			for (const [dependency, value] of Object.entries(dependencies)) {
				const fallback = Object.hasOwn(fallbacks, dependency)
					? fallbacks[dependency]
					: undefined;

				dependencies[dependency] =
					fallback !== undefined && isWildcard(value)
						? fallback
						: pinVersion(value);
			}
		}

		return pkg;
	}) satisfies ReadPackageHook;
}

/** Pin all dependencies in a pnpm workspace (including nested dependencies) */
export const pinAllDependencies = createPinAllDependencies();
