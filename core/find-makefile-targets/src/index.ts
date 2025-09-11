import parser from "@kba/makefile-parser";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

export async function main() {
	const input = process.argv.at(2);

	if (!input) {
		console.error("no file provided");
		return process.exit(0);
	}

	const filename = path.resolve(process.cwd(), input);
	const file = await fsp.readFile(filename, { encoding: "utf8" });

	const parsed = parser(file);

	const targets = parsed.ast.map((tree) => tree.target).filter(Boolean);

	if (!targets.length) {
		console.info("no targets found for file: ", filename);
		return process.exit(0);
	}

	for (const target of targets) {
		console.info(target);
	}
}
