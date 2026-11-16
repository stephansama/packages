import picomatch from "picomatch";

import type { Field, Finding, Kind } from "./finding";

export type FilterOptions = {
	/** Drop findings whose parent or dependency matches any of these globs */
	exclude?: readonly string[];
	/** Keep only findings whose parent or dependency matches one of these globs */
	include?: readonly string[];
	/** Keep only these kinds */
	kinds?: readonly Kind[];
};

export function filterFindings(
	findings: readonly Finding[],
	options: FilterOptions,
): Finding[] {
	const include = toMatcher(options.include);
	const exclude = toMatcher(options.exclude);
	const kinds = options.kinds?.length ? new Set(options.kinds) : undefined;

	return findings.filter((finding) => {
		if (kinds && !kinds.has(finding.kind)) return false;
		if (include && !matchesEither(include, finding)) return false;
		if (exclude && matchesEither(exclude, finding)) return false;
		return true;
	});
}

/** Sort by `field`, then by dependency, parent and parent version */
export function sortFindings(
	findings: readonly Finding[],
	field: Field = "dependency",
): Finding[] {
	const order: Field[] = [field, "dependency", "parent", "parentVersion"];

	return findings.toSorted((a, b) => {
		for (const key of order) {
			const result = String(a[key] ?? "").localeCompare(
				String(b[key] ?? ""),
			);
			if (result !== 0) return result;
		}
		return 0;
	});
}

function matchesEither(matcher: picomatch.Matcher, finding: Finding) {
	return matcher(finding.parent) || matcher(finding.dependency);
}

function toMatcher(globs: readonly string[] | undefined) {
	if (!globs?.length) return;
	return picomatch([...globs]);
}
