import type { Finding } from "../finding";
import type { FormatOptions } from "./options";

import { fieldValue, resolveFields } from "./options";

const needsQuotesRegex = /[\n\r",]/;

/** RFC 4180 CSV, with CRLF line endings */
export function formatCsv(
	findings: readonly Finding[],
	options: FormatOptions = {},
): string {
	const fields = resolveFields(options);
	const rows = findings.map((finding) =>
		fields.map((field) => fieldValue(finding, field)),
	);
	if (options.header !== false) rows.unshift([...fields]);

	return rows
		.map((row) => row.map((value) => quote(value)).join(",") + "\r\n")
		.join("");
}

function quote(value: string) {
	if (!needsQuotesRegex.test(value)) return value;
	return `"${value.replaceAll('"', '""')}"`;
}
