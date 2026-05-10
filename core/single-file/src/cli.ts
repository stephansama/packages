#!/usr/bin/env node

import { cli } from "cleye";
import * as fs from "node:fs";

import { convertPageToSingleFile } from "./convert";
import * as log from "./log";

await run();

export async function run() {
	const argv = cli({
		flags: {
			output: {
				alias: "o",
				default: "single-file.html",
				description: "output path for single html file",
				type: String,
			},
			verbose: {
				alias: "v",
				default: false,
				description: "Verbose output",
				type: Boolean,
			},
		},
		name: "single-file",
		parameters: [`<url>`],
	});

	log.enable(argv.flags.verbose);

	const file = await convertPageToSingleFile(argv._.url);

	await fs.promises.writeFile(argv.flags.output, file, "utf8");
}
