import type { Config } from "eslint/config";

import * as prompts from "@clack/prompts";
import { cli, command, type Flags } from "cleye";
import path from "node:path";
import { register } from "tsx/esm/api";

import type { Preset } from "@/types";

import * as presets from "@/presets";

const flags = {
	config: {
		alias: "c",
		default: "eslint.config.ts",
		description: "Location of eslint configuration file",
		type: String,
	},
	verbose: {
		alias: "v",
		default: false,
		description: "Verbose output",
		type: Boolean,
	},
} as const satisfies Flags;

const afterSlashRegex = /\/.*/;

export async function run() {
	const input = cli({
		commands: [
			command({
				flags,
				help: {
					description: "generate an eslint config based on prompts",
				},
				name: "generate",
			}),
			command({
				flags,
				help: {
					description: `update eslint dependencies to current eslint config options`,
				},
				name: "update",
			}),
		],
		flags,
		name: "@stephansama/eslint-config",
	});

	const unregister = register();

	const configPath = path.join(process.cwd(), input.flags.config);

	const loaded = (await import(configPath)) as { default: Config[] };

	const loadedConfigurations = new Set(
		loaded.default
			.map((current) => current.name)
			.filter((current): current is string => !!current)
			.map((item) => {
				return item
					.replace("stephansama/", "")
					.replace(afterSlashRegex, "");
			}),
	);

	switch (input.command) {
		case "generate": {
			const selectedPresets = await prompts.autocompleteMultiselect({
				message: "select presets",
				options: Object.keys(presets).map((option) => ({
					hint: getPresetDescription(option as Preset),
					label: option,
					value: option,
				})),
			});

			if (prompts.isCancel(selectedPresets)) {
				await unregister();
				return;
			}

			const selectedConfigurations = selectedPresets.map(
				(preset): preset is Preset => !!preset,
			);

			console.info("generating eslint config");
			break;
		}
		case "update": {
			const dependencies = Array.from(loadedConfigurations, (item) => {
				return item
					.replace("stephansama/", "")
					.replace(afterSlashRegex, "");
			});

			console.info("updating eslint config", dependencies);
			break;
		}
		default: {
			throw new Error("unable to handle unknown command");
		}
	}

	await unregister();
}

function getPresetDescription(preset: Preset) {
	switch (preset) {
		case "base": {
			return "defaults recommended for all projects";
		}
		case "library": {
			return "sensible npm library defaults";
		}
	}
}
