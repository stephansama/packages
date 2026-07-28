import * as fsp from "node:fs/promises";
import path from "node:path";
import { stringify as stringifyToml } from "smol-toml";
import yaml from "yaml";

import { configSchema } from "./schema";

export type GenerateOptions = {
	filename?: string;
	force?: boolean;
};

const DEFAULT_FILENAME = ".autoreadmerc.json";

export async function generate(argv: readonly string[]): Promise<void> {
	const force = argv.includes("--force") || argv.includes("-f");
	const positional = argv.find((argument) => !argument.startsWith("-"));
	const filename = positional || DEFAULT_FILENAME;

	if (!force && (await fileExists(filename))) {
		throw new Error(
			`Refusing to overwrite existing file: ${filename}. Pass --force to overwrite.`,
		);
	}

	const defaults = buildDefaults();
	const contents = serialize(filename, defaults);

	await fsp.writeFile(filename, contents, "utf8");
	// eslint-disable-next-line no-console
	console.log(`Wrote ${filename}`);
}

/**
 * Build the fully-populated default config object by parsing an empty seed
 * through the Zod schema. Two top-level array fields (`affectedRegexes`,
 * `collapseHeadings`) have no schema default, so we seed them with empty arrays
 * here.
 */
function buildDefaults(): unknown {
	return configSchema.unwrap().parse({
		affectedRegexes: [],
		collapseHeadings: [],
	});
}

async function fileExists(filepath: string): Promise<boolean> {
	try {
		await fsp.access(filepath);
		return true;
	} catch {
		return false;
	}
}

function serialize(filename: string, defaults: unknown): string {
	const extension = path.extname(filename).toLowerCase();
	switch (extension) {
		case ".toml": {
			return stringifyToml(defaults as Record<string, unknown>);
		}
		case ".yaml":
		case ".yml": {
			return yaml.stringify(defaults);
		}
		default: {
			return JSON.stringify(defaults, undefined, 2) + "\n";
		}
	}
}
