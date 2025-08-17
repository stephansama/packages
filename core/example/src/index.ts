import { downloadTemplate } from "@bluwy/giget-core";
import * as clack from "@clack/prompts";
import * as path from "node:path";

import examples from "../dist/examples.json" with { type: "json" };

export async function main() {
	clack.intro("create @stephansama example projects");

	const example = await clack.select({
		message: "Select an example:",
		options: examples.map((example) => {
			const name = example.name.replace("@example/", "");
			return {
				description: example.description,
				label: `${name} (v${example.version})`,
				value: name,
			};
		}),
	});

	if (clack.isCancel(example)) return cancel();

	const defaultDir = `./${example.split("/").at(0)}`;

	const dir = await clack.text({
		defaultValue: defaultDir,
		message: "Input the directory to clone to:",
		placeholder: defaultDir,
	});

	if (clack.isCancel(dir)) return cancel();

	const spinner = clack.spinner();
	spinner.start("Downloading template");

	await downloadTemplate(`github:stephansama/packages/examples/${example}`, {
		cwd: path.resolve(),
		dir,
		force: true,
	}).catch((e) => console.error(e));

	spinner.stop("Downloaded example");

	clack.outro(`successfully downloaded example template to ${dir}`);
}

function cancel() {
	clack.cancel("Operation canceled");
	process.exit(0);
}
