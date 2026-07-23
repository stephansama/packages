import { applyRules } from "@/apply";
import { checkRules } from "@/check";
import { actions } from "@/commands";
import { loadConfig } from "@/config";
import { enable } from "@/log";

import { cliArguments } from "./arguments";
import { getFlag } from "./flags";

export async function run() {
	if (cliArguments.command && cliArguments.command in actions) {
		await actions[cliArguments.command](cliArguments);
		return;
	}

	enable(getFlag(cliArguments, "verbose"));

	const config = await loadConfig(cliArguments);

	const dirty = await checkRules(config);

	if (dirty.length === 0) return console.info("no files to change");

	if (getFlag(cliArguments, "fix")) {
		await applyRules(dirty, config.rules);
	}
}
