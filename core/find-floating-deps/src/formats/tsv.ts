import type { Finding } from "../finding";
import type { FormatOptions } from "./options";

import { fieldValue, resolveFields } from "./options";

const escapes: Record<string, string> = {
	"\t": String.raw`\t`,
	"\n": String.raw`\n`,
	"\r": String.raw`\r`,
	"\\": String.raw`\\`,
};

const escapeRegex = /[\t\n\r\\]/g;

/** Tab-separated rows, with tabs, newlines and backslashes escaped */
export function formatTsv(
	findings: readonly Finding[],
	options: FormatOptions = {},
): string {
	const fields = resolveFields(options);
	const rows = findings.map((finding) =>
		fields.map((field) => fieldValue(finding, field)),
	);
	if (options.header !== false) rows.unshift([...fields]);

	return rows
		.map((row) => row.map((value) => escape(value)).join("\t") + "\n")
		.join("");
}

function escape(value: string) {
	return value.replaceAll(
		escapeRegex,
		(character) => escapes[character] ?? "",
	);
}
