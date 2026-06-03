import { command } from "cleye";
import pc from "picocolors";

import type { CliArguments } from "@/cli/arguments";
import type { Rule } from "@/rule";

import { getFlag } from "@/cli/flags";
import { loadConfig } from "@/config";

function propertyToColor(
	property: keyof Rule,
	value: boolean | string | undefined,
) {
	switch (property) {
		case "enabled": {
			return value === "true" ? pc.green : pc.red;
		}
		case "parse": {
			if (value === "json") return pc.yellow;
			if (value === "toml") return pc.green;
			if (value === "yaml") return pc.red;
			if (value === "txt") return pc.blue;
			if (value === "function") {
				return (input: string) => pc.bgBlack(pc.red(input));
			}
			return pc.red;
		}
		case "pattern": {
			return pc.blue;
		}
		default: {
			return (input: string) => input;
		}
	}
}

export const meta = command({
	alias: "ls",
	flags: {
		affected: {
			alias: "a",
			default: false,
			description: "show the affected files by the rule",
			type: Boolean,
		},
		config: {
			alias: "c",
			default: "",
			description: "config file",
			type: String,
		},
		json: {
			default: false,
			description: "export as json",
			type: Boolean,
		},
	},
	name: "list",
});

export async function act(arguments_: CliArguments) {
	const config = await loadConfig(arguments_);

	const rules = Object.values(config.rules);

	const properties = ["enabled", "pattern", "parse"] satisfies Array<
		keyof Rule
	>;

	const json = getFlag(arguments_, "json");

	if (json) {
		return console.info(
			JSON.stringify(
				rules.map((rule) => {
					// @ts-expect-error need to delete anyway
					delete rule.when;
					delete rule.apply;
					delete rule.context;
					return rule;
				}),
				undefined,
				2,
			),
		);
	}

	const padding = Math.max(...properties.map((property) => property.length));

	for (const rule of rules) {
		console.info(`${pc.bold("-")} ${pc.green(pc.bold(rule.name))}`);
		for (const property of properties) {
			const current = rule[property];
			const value = typeof current === "function" ? "function" : current;
			const color = propertyToColor(property, value?.toString());
			console.info(
				`  ${property}: `.padEnd(padding + 4) +
					pc.bold(color(`${value}`)),
			);
		}
	}
}
