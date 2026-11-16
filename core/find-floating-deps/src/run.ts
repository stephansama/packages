import * as fs from "node:fs";
import path from "node:path";
import pc from "picocolors";

import type { DepType, Field, Finding, Kind } from "./finding";
import type { FormatName } from "./format";

import { filterFindings, sortFindings } from "./filter";
import { defaultDepTypes, depTypes, fields, kinds } from "./finding";
import {
	formatFromPath,
	formatNames,
	formatters,
	parseFormatName,
} from "./format";
import { formatMarkdown } from "./formats/markdown";
import { scan } from "./scan";
import { describeSummary, summarize } from "./summary";

/** Flags as parsed by the CLI, before validation */
export type RawFlags = {
	csv?: boolean;
	depTypes?: string[];
	exclude?: string[];
	failOn?: string[];
	fields?: string[];
	format?: string;
	include?: string[];
	json?: boolean;
	kind?: string[];
	list?: boolean;
	noColor?: boolean;
	noHeader?: boolean;
	output?: string;
	sort?: string;
	workspaceOnly?: boolean;
};

export type RunEnvironment = {
	env: NodeJS.ProcessEnv;
	isTTY: boolean;
	write: (text: string) => void;
};

export type RunOptions = {
	color: boolean;
	cwd: string;
	depTypes: readonly DepType[];
	exclude: readonly string[];
	failOn: readonly Kind[];
	fields?: readonly Field[];
	format: FormatName;
	header: boolean;
	include: readonly string[];
	kinds: readonly Kind[];
	output?: string;
	sort: Field;
	workspaceOnly: boolean;
};

/** Invalid flags or arguments, reported with exit code `2` */
export class UsageError extends Error {
	override name = "UsageError";
}

export const exitCodes = { clean: 0, error: 2, failed: 1 } as const;

const allKeyword = "all";

export function resolveOptions(
	flags: RawFlags,
	directory: string | undefined,
	environment: Pick<RunEnvironment, "env" | "isTTY">,
): RunOptions {
	const requestedDepTypes = splitList(flags.depTypes);
	const fieldList = splitList(flags.fields);

	return {
		color:
			!flags.noColor &&
			!flags.output &&
			environment.isTTY &&
			pc.isColorSupported &&
			!environment.env.NO_COLOR,
		cwd: path.resolve(directory ?? "."),
		depTypes:
			requestedDepTypes.length > 0
				? parseChoices(requestedDepTypes, depTypes, "--dep-types")
				: defaultDepTypes,
		exclude: splitList(flags.exclude),
		failOn: parseChoices(splitList(flags.failOn), kinds, "--fail-on"),
		fields:
			fieldList.length > 0
				? parseChoices(fieldList, fields, "--fields", false)
				: undefined,
		format: resolveFormat(flags, environment.isTTY),
		header: !flags.noHeader,
		include: splitList(flags.include),
		kinds: parseChoices(splitList(flags.kind), kinds, "--kind"),
		output: flags.output,
		sort: flags.sort
			? parseChoices([flags.sort], fields, "--sort", false)[0]
			: "dependency",
		workspaceOnly: flags.workspaceOnly ?? false,
	};
}

/** Scan, filter, print, and return the exit code */
export async function run(
	options: RunOptions,
	environment: RunEnvironment,
): Promise<number> {
	const scanned = await scan({
		cwd: options.cwd,
		depTypes: options.depTypes,
		workspaceOnly: options.workspaceOnly,
	});

	const findings = sortFindings(
		filterFindings(scanned, options),
		options.sort,
	);

	const text = formatters[options.format](findings, {
		color: options.color,
		fields: options.fields,
		header: options.header,
	});

	if (options.output) {
		await fs.promises.writeFile(options.output, text);
	} else {
		environment.write(text);
	}

	const stepSummary = environment.env.GITHUB_STEP_SUMMARY;
	if (options.format === "github" && stepSummary) {
		await fs.promises.appendFile(
			stepSummary,
			githubStepSummary(findings, options.fields),
		);
	}

	const failOn = new Set(options.failOn);
	const failed = findings.some((finding) => failOn.has(finding.kind));

	return failed ? exitCodes.failed : exitCodes.clean;
}

function githubStepSummary(
	findings: readonly Finding[],
	fieldList: readonly Field[] | undefined,
) {
	const heading = `## Floating dependencies\n\n${describeSummary(summarize(findings))}\n`;
	if (findings.length === 0) return heading;
	return `${heading}\n${formatMarkdown(findings, { fields: fieldList })}`;
}

function parseChoices<Choice extends string>(
	values: readonly string[],
	choices: readonly Choice[],
	flag: string,
	allowAll = true,
): Choice[] {
	if (allowAll && values.includes(allKeyword)) return [...choices];

	for (const value of values) {
		if (!(choices as readonly string[]).includes(value)) {
			const expected = allowAll ? [...choices, allKeyword] : choices;
			throw new UsageError(
				`unknown ${flag} value "${value}". Expected one of: ${expected.join(", ")}`,
			);
		}
	}

	return [...new Set(values)] as Choice[];
}

function parseFormat(name: string) {
	const format = parseFormatName(name);
	if (!format) {
		throw new UsageError(
			`unknown --format "${name}". Expected one of: ${formatNames.join(", ")}`,
		);
	}
	return format;
}

function resolveFormat(flags: RawFlags, isTTY: boolean): FormatName {
	const requested: FormatName[] = [];
	if (flags.format) requested.push(parseFormat(flags.format));
	if (flags.list) requested.push("list");
	if (flags.csv) requested.push("csv");
	if (flags.json) requested.push("json");

	const unique = [...new Set(requested)];
	if (unique.length > 1) {
		throw new UsageError(`conflicting formats: ${unique.join(", ")}`);
	}

	if (unique[0]) return unique[0];
	if (flags.output) return formatFromPath(flags.output) ?? "tsv";
	return isTTY ? "table" : "tsv";
}

/** Split repeated and comma-separated flag values */
function splitList(values: readonly string[] | undefined): string[] {
	return (values ?? [])
		.flatMap((value) => value.split(","))
		.map((value) => value.trim())
		.filter(Boolean);
}
