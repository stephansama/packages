import type { Finding } from "../finding";

import { depTypes, kinds } from "../finding";
import { summarize } from "../summary";

/** Counts only, by `kind` and `depType` */
export function formatSummary(findings: readonly Finding[]): string {
	const summary = summarize(findings);

	const sections: Array<[string, Array<[string, number]>]> = [
		[
			"total",
			[
				["floating", summary.total],
				["pinnable", summary.pinnable],
			],
		],
		["kind", kinds.map((kind) => [kind, summary.byKind[kind] ?? 0])],
		[
			"depType",
			depTypes.map((depType) => [
				depType,
				summary.byDepType[depType] ?? 0,
			]),
		],
	];

	const width = Math.max(
		...sections.flatMap(([, rows]) => rows.map(([label]) => label.length)),
	);

	return sections
		.map(([title, rows]) => {
			const lines = rows
				.filter(([, count]) => count > 0 || title === "total")
				.map(([label, count]) => `  ${label.padEnd(width)}  ${count}`);
			return lines.length > 0 ? [title, ...lines].join("\n") + "\n" : "";
		})
		.filter(Boolean)
		.join("\n");
}
