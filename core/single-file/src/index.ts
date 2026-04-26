import * as cheerio from "cheerio";
import { cli } from "cleye";
import ky from "ky";
import * as fs from "node:fs";

import { writeImportMap } from "./import-map";
import * as inline from "./inline";
import * as log from "./log";

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

	const pageResponse = await ky.get(argv._.url);

	log.info(`loading ${argv._.url}`);

	if (!pageResponse?.headers?.get("Content-Type")?.includes("text/html")) {
		throw new Error(
			`requested url \`${argv._.url}\` must be an html page.`,
		);
	}

	const page = await pageResponse.text();

	const $ = cheerio.load(page);

	for (const inlineCallback of Object.values(inline)) {
		await inlineCallback($, argv._.url);
	}

	const registryScript = await writeImportMap();

	$("head").prepend(registryScript);

	await fs.promises.writeFile(argv.flags.output, $.html(), "utf8");
}
