import type { BaseManifest } from "@pnpm/types";

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

/**
 * Pin a version range to its lower bound, so `^1.2.3`, `~1.2.3`, `>=1.2.3` and
 * the hyphen range `1.2.3 - 2.0.0` all become `1.2.3`.
 *
 * Anything without one exact lower bound (`||`, x-ranges like `1.x`, partial
 * versions like `^1.2`, `>`, `<`, `*`, dist-tags) is left as written, as are
 * protocols such as `workspace:`, `catalog:`, `file:` and git urls: rewriting
 * those would change what they resolve to instead of pinning them.
 */
export function pinVersion(version: string): string {
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

/** Dependency fields that `pinAllDependencies` rewrites with {@link pinVersion} */
export const pinnableDependencyTypes = [
	"dependencies",
	"devDependencies",
	"optionalDependencies",
] as const satisfies Array<
	keyof Pick<
		BaseManifest,
		"dependencies" | "devDependencies" | "optionalDependencies"
	>
>;
