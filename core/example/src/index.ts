import { downloadTemplate } from "@bluwy/giget-core";
import {
	cancel,
	intro,
	isCancel,
	outro,
	select,
	spinner,
	text,
} from "@clack/prompts";
import * as path from "node:path";

import examples from "../dist/examples.json" with { type: "json" };

export async function main() {
	intro("create @stephansama example projects");

	const example = await select({
		message: "Select an example:",
		options: examples.map((example) => {
			const name = example.name.replace("@example/", "");
			return {
				description: example.description,
				label: `${name} v${example.version}`,
				value: name,
			};
		}),
	});

	if (isCancel(example)) {
		cancel("Operation cancelled");
		return process.exit(0);
	}

	const defaultDir = `./${example}`;

	const dir = await text({
		defaultValue: defaultDir,
		message: "Input the directory to clone to:",
		placeholder: defaultDir,
	});

	if (isCancel(dir)) {
		cancel("Operation cancelled");
		return process.exit(0);
	}

	const s = spinner();
	s.start("Downloading template");

	await downloadTemplate(`github:stephansama/packages/examples/${example}`, {
		cwd: path.resolve(),
		dir,
		force: true,
	}).catch((e) => console.error(e));

	s.stop("Downloaded example");

	outro(`successfully downloaded example template to ${dir}`);
}
