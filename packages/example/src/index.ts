import { downloadTemplate } from "@bluwy/giget-core";
import { input, select } from "@inquirer/prompts";
import * as path from "node:path";

import examples from "../scripts/examples.json" with { type: "json" };

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
		.then(() => console.info(`successfully downloaded template to ${dir}`))
		.catch((e) => console.error(e));

	console.info(
		"\n\nplease run (npm|yarn|pnpm|bun) install command to finish installation",
	);
}
