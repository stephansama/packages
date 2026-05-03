import * as cheerio from "cheerio";
import ky from "ky";

import { writeImportMap } from "./import-map";
import * as inline from "./inline";
import * as log from "./log";

export async function convertPageToSingleFile(url: string) {
	const pageResponse = await ky.get(url);

	log.info(`loading ${url}`);

	if (!pageResponse?.headers?.get("Content-Type")?.includes("text/html")) {
		throw new Error(`requested url \`${url}\` must be an html page.`);
	}

	const page = await pageResponse.text();

	const $ = cheerio.load(page);

	for (const inlineCallback of Object.values(inline)) {
		await inlineCallback($, url);
	}

	const registryScript = writeImportMap();

	$("head").prepend(registryScript);

	return $.html();
}
