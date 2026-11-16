import type { Finding } from "../finding";
import type { FormatOptions } from "./options";

import { fieldValue, resolveFields } from "./options";

const specialRegex = /[\\`|]/g;
const newlineRegex = /\r?\n/g;

/** GitHub-flavored markdown table */
export function formatMarkdown(
	findings: readonly Finding[],
	options: FormatOptions = {},
): string {
	const fields = resolveFields(options);
	const lines = findings.map((finding) =>
		row(fields.map((field) => escape(fieldValue(finding, field)))),
	);

	if (options.header !== false) {
		lines.unshift(row([...fields]), row(fields.map(() => "---")));
	}

	return lines.map((line) => line + "\n").join("");
}

function escape(value: string) {
	return value
		.replaceAll(specialRegex, (character) => `\\${character}`)
		.replaceAll(newlineRegex, "<br>");
}

function row(cells: string[]) {
	return `| ${cells.join(" | ")} |`;
}
