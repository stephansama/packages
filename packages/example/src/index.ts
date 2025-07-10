/* eslint no-console: ["off"] */
import { downloadTemplate } from "@bluwy/giget-core";
import { input, select } from "@inquirer/prompts";
import latestVersion from "latest-version";
import * as fs from "node:fs";
import * as path from "node:path";

import examples from "../scripts/examples.json" with { type: "json" };

export async function convertDependencies(
	dependencies: null | Record<string, number | string> | undefined,
) {
	if (!dependencies) return {};
	return (
		await Promise.all(
			Object.entries(dependencies).map(async ([pkg, ver]) => {
				if (ver !== "workspace:*") return [pkg, ver];
				const latest = await latestVersion(pkg);
				return [pkg, latest];
			}),
		)
	).reduce((prev, [pkg, ver]) => ({ ...prev, [pkg]: ver }), {});
}

export async function main() {
	const example = (
		await select({
			choices: examples.map((example) => ({
				description: example.description,
				name: `${example.name} v${example.version}`,
				value: example.name,
			})),
			message: "Select an example:",
		})
	).replace("@example", "examples");

	const dir = await input({
		default: ".",
		message: "Input the directory to clone to:",
	});

	const template = `github:stephansama/packages/${example}`;

	await downloadTemplate(template, { cwd: path.resolve(), dir, force: true })
		.then(() => console.log(`successfully downloaded template to ${dir}`))
		.catch((e) => console.error(e));

	const packageJson = dir.endsWith("/") ? dir : dir + "/" + "package.json";

	const original = JSON.parse(
		fs.readFileSync(packageJson, { encoding: "utf8" }),
	);

	const dependencies = original.dependencies
		? await convertDependencies(original.dependencies)
		: {};

	const devDependencies = original.devDependencies
		? await convertDependencies(original.devDependencies)
		: {};

	const configuredJson = {
		...original,
		dependencies,
		devDependencies,
	};

	fs.writeFileSync(packageJson, JSON.stringify(configuredJson, undefined, 2));

	console.log(
		"\n\nplease run (npm|yarn|pnpm|bun) install command to finish installation",
	);
}
