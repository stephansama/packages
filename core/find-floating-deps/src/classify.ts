import type { Kind } from "./finding";

/** `workspace:`, `catalog:`, `file:`, `link:`, `git+https:`, `github:` and so on */
const protocolRegex = /^[a-z][\d+.a-z-]*:/i;

/** `npm:<name>@<range>` aliases, where `<name>` may be scoped */
const npmAliasRegex = /^npm:(?:@[^@/]+\/)?[^@]+@(?<range>.*)$/;

/** Local paths and `user/repo` git shorthands */
const pathOrRepoRegex = /^(?:\.{1,2}\/|\/|~\/)|^[^@\s/][^\s/]*\/[^\s/]/;

/** `<from> - <to>` */
const hyphenRegex = /^\S+\s+-\s+\S+$/;

/** Operators followed by whitespace, as in `>= 1.2.3` */
const spacedOperatorRegex = /(?<operator>[<=>^~])\s+/g;

const whitespaceRegex = /\s+/;

const operatorRegex = /^(?<operator>\^|~>?|>=?|<=?|=)?(?<version>.*)$/;

const wildcardRegex = /^[*x]$/i;

/** A full or partial version where any part may be `x` or `*` */
const versionRegex =
	/^v?(?<major>\d+|[*x])(?:\.(?<minor>\d+|[*x]))?(?:\.(?<patch>\d+|[*x]))?(?:-[\w.-]+)?(?:\+[\w.-]+)?$/i;

/**
 * Classify a dependency spec by how it floats, or `undefined` when it can't
 * resolve to anything newer: exact versions and protocols such as `workspace:`,
 * `catalog:`, `file:`, `link:`, git urls and tarballs. `npm:` aliases are
 * classified by the range after the `@`.
 */
export function classifySpec(spec: string): Kind | undefined {
	const trimmed = spec.trim();

	const alias = npmAliasRegex.exec(trimmed)?.groups;
	if (alias) return classifySpec(alias.range ?? "");

	if (protocolRegex.test(trimmed) || pathOrRepoRegex.test(trimmed)) {
		return undefined;
	}

	if (trimmed === "" || wildcardRegex.test(trimmed)) return "wildcard";
	if (trimmed.includes("||")) return "union";
	if (hyphenRegex.test(trimmed)) return "hyphen";

	const comparators = trimmed
		.replaceAll(spacedOperatorRegex, "$<operator>")
		.split(whitespaceRegex);

	if (comparators.length > 1) return "intersection";

	return classifyComparator(comparators[0] ?? "");
}

function classifyComparator(comparator: string): Kind | undefined {
	const { operator = "", version = "" } =
		operatorRegex.exec(comparator)?.groups ?? {};

	const parts = versionRegex.exec(version)?.groups;
	if (!parts) return operator ? "comparison" : "tag";

	if (operator.startsWith(">") || operator.startsWith("<")) {
		return "comparison";
	}

	const { major, minor, patch } = parts;
	const segments = [major, minor, patch];

	if (segments.some((part) => part && wildcardRegex.test(part))) {
		return wildcardRegex.test(major ?? "") ? "wildcard" : "x-range";
	}

	if (!minor || !patch) return "partial";
	if (operator === "^") return "caret";
	if (operator.startsWith("~")) return "tilde";

	return undefined;
}
