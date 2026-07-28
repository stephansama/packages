#!/usr/bin/env node

import { cli, command } from "cleye";

import { generate } from "./generate";
import { run } from "./index";

const generateCommand = command(
	{
		flags: {
			force: {
				alias: "f",
				default: false,
				description: "Overwrite the target file if it already exists",
				type: Boolean,
			},
		},
		name: "generate",
		parameters: ["[filename]"],
	},
	async (argv) => {
		const passthrough: string[] = [];
		if (argv._.filename) passthrough.push(argv._.filename);
		if (argv.flags.force) passthrough.push("--force");
		await generate(passthrough);
	},
);

const argv = cli({
	commands: [generateCommand],
	name: "auto-readme",
});

if (!argv.command) {
	await run();
}
