import type { Field, Finding } from "../finding";

import { fields as allFields } from "../finding";

export type FormatOptions = {
	/** Use ANSI colors, for formats that have them */
	color?: boolean;
	/** Columns to show, in order, for tabular formats */
	fields?: readonly Field[];
	/** Print a header row, for `csv`, `tsv` and `markdown` */
	header?: boolean;
};

export type Formatter = (
	findings: readonly Finding[],
	options?: FormatOptions,
) => string;

export function fieldValue(finding: Finding, field: Field): string {
	const value = finding[field];
	return value === undefined ? "" : String(value);
}

export function resolveFields(options: FormatOptions | undefined) {
	return options?.fields?.length ? options.fields : allFields;
}
