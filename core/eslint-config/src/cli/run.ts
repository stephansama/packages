import type { Config } from "eslint/config";

import * as prompts from "@clack/prompts";
import { cli, command, type Flags } from "cleye";
import fs from "node:fs";
import path from "node:path";
import { register } from "tsx/esm/api";

import type { Preset } from "@/types";

import * as configs from "@/configs";
import { dependenciesMap } from "@/dependencies";
import * as presets from "@/presets";

import packageJson from "../../package.json";

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
				flags: {
					...flags,
					["package-json"]: {
						alias: "p",
						default: "package.json",
						description: "location of package.json to update",
						type: String,
					},
				},
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
			const selectedPresets = await prompts.multiselect({
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

			const selectedConfigurations = selectedPresets.filter(
				(preset): preset is Preset => !!preset,
			);

			let accumulated = {};

			const allConfigKeys = new Set(Object.keys(configs));

			for (const config of selectedConfigurations) {
				accumulated = { ...accumulated, ...presets[config] };
			}

			const accumulatedKeys = Object.keys(accumulated);

			/* eslint-disable baseline-js/use-baseline */
			const missing = allConfigKeys.difference(new Set(accumulatedKeys));

			const additionalConfigurations =
				await prompts.autocompleteMultiselect({
					message: "add any other additional configurations",
					options: Array.from(missing, (item) => ({
						label: item,
						value: item,
					})),
				});

			if (prompts.isCancel(additionalConfigurations)) {
				await unregister();
				return;
			}

			console.info(
				"generating eslint config with loaded configurations",
				accumulatedKeys,
				additionalConfigurations,
			);
			break;
		}
		case "update": {
			const packageJsonFile = await fs.promises.readFile(
				input.flags["package-json"],
				"utf8",
			);
			const userPackageJson = JSON.parse(
				packageJsonFile,
			) as typeof packageJson;
			const userDependencies = {
				...userPackageJson.dependencies,
				...userPackageJson.devDependencies,
			};
			const dependencies = [...loadedConfigurations]
				.flatMap(
					(config) =>
						dependenciesMap[config as keyof typeof dependenciesMap],
				)
				.filter((config) => !!config);

			console.info(
				"updating eslint config",
				JSON.stringify(
					{
						dependencies,
						userDependencies,
					},
					undefined,
					2,
				),
			);
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
