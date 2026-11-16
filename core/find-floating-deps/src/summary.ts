import type { DepType, Finding, Kind } from "./finding";

export type Summary = {
	byDepType: Partial<Record<DepType, number>>;
	byKind: Partial<Record<Kind, number>>;
	pinnable: number;
	total: number;
};

/** `3 floating dependencies (2 wildcard, 1 caret), 1 pinnable` */
export function describeSummary(summary: Summary): string {
	if (summary.total === 0) return "no floating dependencies";

	const noun = summary.total === 1 ? "dependency" : "dependencies";
	const kinds = Object.entries(summary.byKind)
		.map(([kind, count]) => `${count} ${kind}`)
		.join(", ");

	return `${summary.total} floating ${noun} (${kinds}), ${summary.pinnable} pinnable`;
}

export function summarize(findings: readonly Finding[]): Summary {
	const summary: Summary = {
		byDepType: {},
		byKind: {},
		pinnable: 0,
		total: findings.length,
	};

	for (const finding of findings) {
		summary.byKind[finding.kind] = (summary.byKind[finding.kind] ?? 0) + 1;
		summary.byDepType[finding.depType] =
			(summary.byDepType[finding.depType] ?? 0) + 1;
		if (finding.pinnable) summary.pinnable++;
	}

	return summary;
}
