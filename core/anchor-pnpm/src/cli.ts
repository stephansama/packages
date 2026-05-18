#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { add, applySyncProposal, list, remove, sync, update } from "./anchors";
import {
	loadWorkspace,
	resolveWorkspacePath,
	saveWorkspace,
} from "./workspace";

type GlobalOptions = {
	dryRun?: boolean;
	verbose?: boolean;
	workspace?: string;
};

await yargs(hideBin(process.argv))
	.scriptName("anchor-pnpm")
	.usage("$0 <command> [options]")
	.option("workspace", {
		alias: "w",
		description: "Path to pnpm-workspace.yaml (default: auto-detect)",
		type: "string",
	})
	.option("dry-run", {
		alias: "d",
		default: false,
		description: "Preview the rewritten YAML without writing",
		type: "boolean",
	})
	.option("verbose", {
		alias: "v",
		default: false,
		description: "Show detailed output",
		type: "boolean",
	})
	.command(
		"list",
		"Print every anchor name and its resolved version.",
		(yargv) => yargv,
		async (argv) => {
			const filepath = await resolveWorkspacePath(
				(argv as GlobalOptions).workspace,
			);
			const document = await loadWorkspace(filepath);
			const entries = list(document);
			if (entries.length === 0) {
				// eslint-disable-next-line no-console
				console.log("(no anchors)");
				return;
			}
			const longest = Math.max(
				...entries.map((entry) => entry.name.length),
			);
			for (const entry of entries) {
				// eslint-disable-next-line no-console
				console.log(`  &${entry.name.padEnd(longest)}  ${entry.value}`);
			}
		},
	)
	.command(
		"add <name> <version>",
		"Append `- &<name> <version>` to __versions.",
		(yargv) =>
			yargv
				.positional("name", { demandOption: true, type: "string" })
				.positional("version", { demandOption: true, type: "string" }),
		async (argv) => {
			const options = argv as GlobalOptions & {
				name: string;
				version: string;
			};
			const filepath = await resolveWorkspacePath(options.workspace);
			const document = await loadWorkspace(filepath);
			const result = add(document, options.name, options.version);
			if (!result.added) {
				throw new Error(`anchor &${options.name} already exists`);
			}
			await commit(filepath, document, options);
		},
	)
	.command(
		"update <name> <version>",
		"Set the scalar value of an existing &<name> entry.",
		(yargv) =>
			yargv
				.positional("name", { demandOption: true, type: "string" })
				.positional("version", { demandOption: true, type: "string" }),
		async (argv) => {
			const options = argv as GlobalOptions & {
				name: string;
				version: string;
			};
			const filepath = await resolveWorkspacePath(options.workspace);
			const document = await loadWorkspace(filepath);
			const result = update(document, options.name, options.version);
			if (!result.updated) {
				throw new Error(
					`anchor &${options.name} not found in __versions`,
				);
			}
			await commit(filepath, document, options);
		},
	)
	.command(
		"remove <name>",
		"Remove the &<name> entry from __versions.",
		(yargv) =>
			yargv
				.positional("name", { demandOption: true, type: "string" })
				.option("force", {
					alias: "f",
					default: false,
					description: "Inline alias references before removing",
					type: "boolean",
				}),
		async (argv) => {
			const options = argv as GlobalOptions & {
				force?: boolean;
				name: string;
			};
			const filepath = await resolveWorkspacePath(options.workspace);
			const document = await loadWorkspace(filepath);
			const result = remove(document, options.name, {
				force: options.force,
			});
			if (!result.removed && result.dangling.length > 0) {
				throw new Error(
					`anchor &${options.name} still has alias references at: ${result.dangling.join(", ")}. Pass --force to inline them.`,
				);
			}
			if (!result.removed) {
				throw new Error(`anchor &${options.name} not found`);
			}
			await commit(filepath, document, options);
		},
	)
	.command(
		"sync",
		"Detect repeated catalog versions and propose anchor+alias pairs.",
		(yargv) =>
			yargv.option("apply", {
				default: false,
				description: "Apply all proposals (otherwise prints only)",
				type: "boolean",
			}),
		async (argv) => {
			const options = argv as GlobalOptions & { apply?: boolean };
			const filepath = await resolveWorkspacePath(options.workspace);
			const document = await loadWorkspace(filepath);
			const proposals = sync(document);
			if (proposals.length === 0) {
				// eslint-disable-next-line no-console
				console.log("No catalog groups with repeated versions.");
				return;
			}
			for (const proposal of proposals) {
				// eslint-disable-next-line no-console
				console.log(
					`&${proposal.anchorName} = ${proposal.version}  (catalog: ${proposal.catalog}, keys: ${proposal.keys.join(", ")})`,
				);
			}
			if (!options.apply) {
				// eslint-disable-next-line no-console
				console.log(
					"\nDry run. Pass --apply to write these anchors + aliases.",
				);
				return;
			}
			for (const proposal of proposals)
				applySyncProposal(document, proposal);
			await commit(filepath, document, options);
		},
	)
	.demandCommand(1)
	.strict()
	.help("h")
	.alias("h", "help")
	.parseAsync();

async function commit(
	filepath: string,
	document: Awaited<ReturnType<typeof loadWorkspace>>,
	options: GlobalOptions,
): Promise<void> {
	if (options.dryRun) {
		// eslint-disable-next-line no-console
		console.log(document.toString());
		return;
	}
	await saveWorkspace(filepath, document);
	if (options.verbose) {
		// eslint-disable-next-line no-console
		console.log(`Wrote ${filepath}`);
	}
}
