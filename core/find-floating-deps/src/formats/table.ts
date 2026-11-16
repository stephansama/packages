import pc from "picocolors";

import type { Field, Finding, Kind } from "../finding";
import type { FormatOptions } from "./options";

import { describeSummary, summarize } from "../summary";
import { fieldValue, resolveFields } from "./options";

type Colors = ReturnType<typeof pc.createColors>;
type Paint = (value: string) => string;

const urgentKinds = new Set<Kind>(["tag", "wildcard"]);

/** Aligned columns with a totals line, for reading in a terminal */
export function formatTable(
	findings: readonly Finding[],
	options: FormatOptions = {},
): string {
	const colors = pc.createColors(options.color ?? false);
	const fields = resolveFields(options);
	const summary = describeSummary(summarize(findings));

	if (findings.length === 0) return colors.green(summary) + "\n";

	const rows = findings.map((finding) =>
		fields.map((field) => fieldValue(finding, field)),
	);
	const widths = fields.map((field, index) =>
		Math.max(field.length, ...rows.map((row) => row[index]?.length ?? 0)),
	);

	const header = padRow(fields, widths, (cell) =>
		colors.bold(colors.underline(cell)),
	);
	const body = findings.map((finding, rowIndex) =>
		padRow(rows[rowIndex] ?? [], widths, (cell, index) =>
			paintField(colors, fields[index], finding)(cell),
		),
	);

	return [header, ...body, "", colors.bold(summary)].join("\n") + "\n";
}

function padRow(
	cells: readonly string[],
	widths: readonly number[],
	paint: (cell: string, index: number) => string,
) {
	return cells
		.map((cell, index) => paint(cell.padEnd(widths[index] ?? 0), index))
		.join("  ")
		.trimEnd();
}

function paintField(
	colors: Colors,
	field: Field | undefined,
	finding: Finding,
): Paint {
	switch (field) {
		case "dependency": {
			return colors.bold;
		}
		case "kind": {
			return urgentKinds.has(finding.kind) ? colors.red : colors.yellow;
		}
		case "parentVersion":
		case "resolved": {
			return colors.dim;
		}
		case "pinnable": {
			return finding.pinnable ? colors.green : colors.dim;
		}
		case "spec": {
			return colors.cyan;
		}
		default: {
			return (value) => value;
		}
	}
}
