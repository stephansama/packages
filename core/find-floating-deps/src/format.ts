import type { Formatter } from "./formats/options";

import { formatCsv } from "./formats/csv";
import { formatGithub } from "./formats/github";
import { formatJson } from "./formats/json";
import { formatJsonl } from "./formats/jsonl";
import { formatList } from "./formats/list";
import { formatMarkdown } from "./formats/markdown";
import { formatSummary } from "./formats/summary";
import { formatTable } from "./formats/table";
import { formatTsv } from "./formats/tsv";

export const formatters = {
	csv: formatCsv,
	github: formatGithub,
	json: formatJson,
	jsonl: formatJsonl,
	list: formatList,
	markdown: formatMarkdown,
	summary: formatSummary,
	table: formatTable,
	tsv: formatTsv,
} as const satisfies Record<string, Formatter>;

export type FormatName = keyof typeof formatters;

export const formatNames = Object.keys(formatters) as FormatName[];

/** Other names accepted by `--format` */
const formatAliases: Record<string, FormatName> = {
	md: "markdown",
	ndjson: "jsonl",
};

const extensionRegex = /\.[^./\\]+$/;

const extensionFormats: Record<string, FormatName> = {
	".csv": "csv",
	".json": "json",
	".jsonl": "jsonl",
	".markdown": "markdown",
	".md": "markdown",
	".ndjson": "jsonl",
	".tsv": "tsv",
};

/** The format for an output file, from its extension */
export function formatFromPath(file: string): FormatName | undefined {
	const match = extensionRegex.exec(file.toLowerCase());
	return match ? extensionFormats[match[0]] : undefined;
}

export function parseFormatName(name: string): FormatName | undefined {
	const normalized = name.trim().toLowerCase();
	if (normalized in formatters) return normalized as FormatName;
	return formatAliases[normalized];
}
