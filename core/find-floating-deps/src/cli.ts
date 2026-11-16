#!/usr/bin/env node

import { cli } from "cleye";

import { depTypes, fields, kinds } from "./finding";
import { formatNames } from "./format";
import { exitCodes, resolveOptions, run, UsageError } from "./run";

const argv = cli({
	flags: {
		csv: { description: "Shorthand for --format csv", type: Boolean },
		depTypes: {
			description: `Dependency fields to check: ${depTypes.join(", ")} or all (default: dependencies,optionalDependencies)`,
			type: [String],
		},
		exclude: {
			description:
				"Skip findings whose parent or dependency matches a glob",
			type: [String],
		},
		failOn: {
			description:
				"Exit 1 when a finding has one of these kinds (or all)",
			type: [String],
		},
		fields: {
			description: `Columns to show, in order: ${fields.join(", ")}`,
			type: [String],
		},
		format: {
			description: `Output format: ${formatNames.join(", ")} (default: table on a TTY, tsv when piped)`,
			type: String,
		},
		include: {
			description:
				"Keep findings whose parent or dependency matches a glob",
			type: [String],
		},
		json: { description: "Shorthand for --format json", type: Boolean },
		kind: {
			description: `Kinds to keep: ${kinds.join(", ")} or all`,
			type: [String],
		},
		list: {
			alias: "1",
			description: "Shorthand for --format list",
			type: Boolean,
		},
		noColor: { description: "Disable colors", type: Boolean },
		noHeader: {
			description: "Omit the header row from csv, tsv and markdown",
			type: Boolean,
		},
		output: {
			alias: "o",
			description:
				"Write to a file, inferring the format from its extension",
			type: String,
		},
		sort: {
			description: `Field to sort by (default: dependency)`,
			type: String,
		},
		workspaceOnly: {
			description:
				"Only check workspace manifests, not third-party packages",
			type: Boolean,
		},
	},
	help: {
		description:
			"Report dependency ranges that can resolve to a newer version than the one installed",
		examples: [
			"find-floating-deps",
			"find-floating-deps --format csv > floating.csv",
			"find-floating-deps -1 | xargs -n1 pnpm why -r",
			"find-floating-deps --kind wildcard --fail-on wildcard",
		],
	},
	name: "find-floating-deps",
	parameters: ["[dir]"],
});

try {
	const environment = {
		env: process.env,
		isTTY: Boolean(process.stdout.isTTY),
		write: (text: string) => process.stdout.write(text),
	};

	// cleye drops unknown flags, so a typo like `--fail-onn` would pass CI
	const unknownFlags = Object.keys(argv.unknownFlags);
	if (unknownFlags.length > 0) {
		throw new UsageError(
			`unknown flag: ${unknownFlags.map((flag) => `--${flag}`).join(", ")}`,
		);
	}

	const options = resolveOptions(argv.flags, argv._.dir, environment);
	process.exitCode = await run(options, environment);
} catch (error) {
	console.error(
		`find-floating-deps: ${error instanceof Error ? error.message : String(error)}`,
	);
	process.exitCode = exitCodes.error;
}
