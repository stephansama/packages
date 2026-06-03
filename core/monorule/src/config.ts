import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";
import { merge } from "es-toolkit/compat";
import * as toml from "smol-toml";

import type { CliArguments } from "@/cli/arguments";
import type { Rule } from "@/rules";
import type { ConfigSchema } from "@/schema";

import { getFlag } from "@/cli/flags";
import { info, warn } from "@/log";
import { loadRules } from "@/rules/load";
import { fullConfigSchema } from "@/schema";
import { name as moduleName } from "~/package.json";

const searchPlaces = getSearchPlaces();

const loaders = { [".toml"]: loadToml };

export async function loadConfig(cliArguments: CliArguments) {
	const options = { loaders, searchPlaces } satisfies Partial<Options>;

	const argumentConfig = getFlag(cliArguments, "config");
	if (argumentConfig) options.searchPlaces = [argumentConfig];

	const explorer = cosmiconfig(moduleName, options);

	const search = await explorer.search();

	if (search) {
		info("found configuration file at:", search.filepath);
		info("loaded cosmiconfig", search.config);
	} else {
		const location = argumentConfig
			? " at location: " + argumentConfig
			: "";
		warn(`no config file found`, location);
		info("using default configuration");
	}

	info("merging config with args", cliArguments);

	const arguments_config = {
		ignorePaths: getFlag(cliArguments, "ignorePaths"),
		ignoreRules: getFlag(cliArguments, "ignoreRules"),
		ruleDirectory: getFlag(cliArguments, "ruleDirectory"),
	} as Partial<ConfigSchema>;

	const config = fullConfigSchema.parse(
		merge(search?.config, removeFalsy(arguments_config)),
	);

	const rules = await loadRules(config, search?.filepath);

	return {
		...config,
		// @ts-expect-error slight mismatch
		rules: validateRules(...config.rules, ...rules),
	};
}

export function loadToml(_filepath: string, content: string) {
	return toml.parse(content);
}

export function validateRules(...rules: Rule[]): Record<string, Rule> {
	const duplicate = hasDuplicate(rules.map((rule) => rule.name));
	if (duplicate) {
		throw new Error(`found a rule with a duplicate name ${duplicate}`);
	}

	return Object.fromEntries(rules.map((rule) => [rule.name, rule]));
}

function getSearchPlaces() {
	return [
		...getDefaultSearchPlaces(moduleName),
		`.${moduleName}rc.toml`,
		`.config/.${moduleName}rc`,
		`.config/${moduleName}rc.toml`,
		`.config/.${moduleName}rc.toml`,
		`.config/.${moduleName}rc.json`,
		`.config/.${moduleName}rc.yaml`,
		`.config/.${moduleName}rc.yml`,
	];
}

function hasDuplicate<T>(input: Array<T>) {
	const seen = new Set();

	for (const s of input) {
		if (seen.has(s)) return s;
		seen.add(s);
	}

	return false;
}

function removeFalsy(object: object) {
	return Object.fromEntries(
		// @ts-expect-error some sort of mismatch
		Object.entries(object)
			.map(([k, v]) => (v ? [k, v] : false))
			.filter(Boolean),
	);
}
