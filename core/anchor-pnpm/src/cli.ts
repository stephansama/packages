#!/usr/bin/env node

import { cli, command } from "cleye";

import { add, applySyncProposal, list, remove, sync, update } from "./anchors";
import {
	loadWorkspace,
	resolveWorkspacePath,
	saveWorkspace,
} from "./workspace";

type GlobalFlags = {
	dryRun: boolean;
	verbose: boolean;
	workspace: string | undefined;
};

const globalFlags = {
	dryRun: {
		alias: "d",
		default: false,
		description: "Preview the rewritten YAML without writing",
		type: Boolean,
	},
	verbose: {
		alias: "v",
		default: false,
		description: "Show detailed output",
		type: Boolean,
	},
	workspace: {
		alias: "w",
		description: "Path to pnpm-workspace.yaml (default: auto-detect)",
		type: String,
	},
} as const;

const listCommand = command(
	{
		flags: globalFlags,
		name: "list",
	},
	async (argv) => {
		const filepath = await resolveWorkspacePath(argv.flags.workspace);
		const document = await loadWorkspace(filepath);
		const entries = list(document);
		if (entries.length === 0) {
			// eslint-disable-next-line no-console
			console.log("(no anchors)");
			return;
		}
		const longest = Math.max(...entries.map((entry) => entry.name.length));
		for (const entry of entries) {
			// eslint-disable-next-line no-console
			console.log(`  &${entry.name.padEnd(longest)}  ${entry.value}`);
		}
	},
);

const addCommand = command(
	{
		flags: globalFlags,
		name: "add",
		parameters: ["<name>", "<version>"],
	},
	async (argv) => {
		const { name, version } = argv._;
		const filepath = await resolveWorkspacePath(argv.flags.workspace);
		const document = await loadWorkspace(filepath);
		const result = add(document, name, version);
		if (!result.added) {
			throw new Error(`anchor &${name} already exists`);
		}
		await commit(filepath, document, argv.flags);
	},
);

const updateCommand = command(
	{
		flags: globalFlags,
		name: "update",
		parameters: ["<name>", "<version>"],
	},
	async (argv) => {
		const { name, version } = argv._;
		const filepath = await resolveWorkspacePath(argv.flags.workspace);
		const document = await loadWorkspace(filepath);
		const result = update(document, name, version);
		if (!result.updated) {
			throw new Error(`anchor &${name} not found in __versions`);
		}
		await commit(filepath, document, argv.flags);
	},
);

const removeCommand = command(
	{
		flags: {
			...globalFlags,
			force: {
				alias: "f",
				default: false,
				description: "Inline alias references before removing",
				type: Boolean,
			},
		},
		name: "remove",
		parameters: ["<name>"],
	},
	async (argv) => {
		const { name } = argv._;
		const filepath = await resolveWorkspacePath(argv.flags.workspace);
		const document = await loadWorkspace(filepath);
		const result = remove(document, name, { force: argv.flags.force });
		if (!result.removed && result.dangling.length > 0) {
			throw new Error(
				`anchor &${name} still has alias references at: ${result.dangling.join(", ")}. Pass --force to inline them.`,
			);
		}
		if (!result.removed) {
			throw new Error(`anchor &${name} not found`);
		}
		await commit(filepath, document, argv.flags);
	},
);

const syncCommand = command(
	{
		flags: {
			...globalFlags,
			apply: {
				default: false,
				description: "Apply all proposals (otherwise prints only)",
				type: Boolean,
			},
		},
		name: "sync",
	},
	async (argv) => {
		const filepath = await resolveWorkspacePath(argv.flags.workspace);
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
		if (!argv.flags.apply) {
			// eslint-disable-next-line no-console
			console.log(
				"\nDry run. Pass --apply to write these anchors + aliases.",
			);
			return;
		}
		for (const proposal of proposals) applySyncProposal(document, proposal);
		await commit(filepath, document, argv.flags);
	},
);

void cli({
	commands: [
		listCommand,
		addCommand,
		updateCommand,
		removeCommand,
		syncCommand,
	],
	name: "anchor-pnpm",
});

async function commit(
	filepath: string,
	document: Awaited<ReturnType<typeof loadWorkspace>>,
	flags: GlobalFlags,
): Promise<void> {
	if (flags.dryRun) {
		// eslint-disable-next-line no-console
		console.log(document.toString());
		return;
	}
	await saveWorkspace(filepath, document);
	if (flags.verbose) {
		// eslint-disable-next-line no-console
		console.log(`Wrote ${filepath}`);
	}
}
