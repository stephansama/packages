import { cosmiconfig, getDefaultSearchPlaces, type Options } from "cosmiconfig";
import { merge } from "es-toolkit/compat";
import * as toml from "smol-toml";

import type { arguments_ as CliArgument } from "./cli";
import type { Rule } from "./rule";

import { name as moduleName } from "../package.json";
import { loadRules } from "./load";
import { type ConfigSchema, fullConfigSchema } from "./schema";

const searchPlaces = getSearchPlaces();

const loaders = { [".toml"]: loadToml };

export async function loadConfig(arguments_: Partial<typeof CliArgument>) {
	const options = { loaders, searchPlaces } satisfies Partial<Options>;

	if (arguments_.command)
		throw new Error("somehow called load config during command");

	if (
		arguments_.flags &&
		"config" in arguments_.flags &&
		arguments_?.flags?.config
	)
		options.searchPlaces = [arguments_.flags.config];

	const explorer = cosmiconfig(moduleName, options);

	const search = await explorer.search();

	if (search) {
		console.info("found configuration file at:", search.filepath);
		console.info("loaded cosmiconfig", search.config);
	} else {
		const location =
			arguments_.flags &&
			"config" in arguments_.flags &&
			arguments_.flags?.config
				? " at location: " + arguments_.flags.config
				: "";
		console.warn(`no config file found`, location);
		console.info("using default configuration");
	}

	arguments_ = removeFalsy(arguments_);

	console.info("merging config with args", arguments_);

	const arguments_config = {
		ignorePaths:
			arguments_.flags &&
			"ignorePaths" in arguments_.flags &&
			arguments_.flags.ignorePaths,
		ignoreRules:
			arguments_.flags &&
			"ignoreRules" in arguments_.flags &&
			arguments_.flags.ignoreRules,
		ruleDirectory:
			arguments_.flags &&
			"ruleDirectory" in arguments_.flags &&
			arguments_.flags.ruleDirectory,
	} as Partial<ConfigSchema>;

	const config = fullConfigSchema.parse(
		merge(merge(search?.config, arguments_config), {
			rules: [],
		}),
	);

	const rules = await loadRules(config, search?.filepath);

	// config.rules.push(...rules);

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
