import { command } from "cleye";
import pc from "picocolors";

import type { cliArguments } from "@/src/cli";

import { loadConfig } from "@/src/config";

import type { Rule } from "../rule";

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
	},
	name: "list",
});

export async function act(arguments_: typeof cliArguments) {
	const config = await loadConfig(arguments_);

	const rules = Object.values(config.rules);

	const properties = ["enabled", "pattern", "parse"] satisfies Array<
		keyof Rule
	>;

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
