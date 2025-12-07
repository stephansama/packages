import type { Package } from "@manypkg/get-packages";

import { downloadTemplate } from "@bluwy/giget-core";
import * as clack from "@clack/prompts";
import * as path from "node:path";

import rootPkgJson from "../../../package.json";
import fallbackExamples from "../../../scripts/dist/examples";

type RelativePackageJSON = Package["packageJson"] & {
	description: string;
	relativeDir: string;
};

export async function fetchExamples() {
	const url = new URL("meta.json", rootPkgJson.homepage).href;
	try {
		const res = await fetch(url);
		const json = await res.json();
		const examples = (json as RelativePackageJSON[]).filter(({ name }) =>
			name.startsWith("@example"),
		);

		if (!examples.length) {
			throw new Error("no examples found from remote");
		}

		return examples;
	} catch {
		console.error(`failed to load remote examples, using local fallback`);
		return fallbackExamples;
	}
}

export async function main() {
	clack.intro("create @stephansama example projects");

	const examples = await fetchExamples();

	const example = await clack.select({
		message: "Select an example:",
		options: examples.map((example) => ({
			description: example.description,
			label: `${example.name.replace("@example/", "")} (v${example.version})`,
			value: example.name,
		})),
	});

	if (clack.isCancel(example)) return cancel();

	const exampleData = examples.find((e) => e.name === example);

	if (!exampleData) throw new Error("unable to find example data");

	const [, ...relativeDir] = exampleData.relativeDir.split("/");

	const defaultDir = "./" + relativeDir.join("-");

	const dir = await clack.text({
		defaultValue: defaultDir,
		message: "Input the directory to clone to:",
		placeholder: defaultDir,
	});

	if (clack.isCancel(dir)) return cancel();

	const spinner = clack.spinner();
	spinner.start("Downloading template");

	await downloadTemplate(
		`github:stephansama/packages/${exampleData.relativeDir}`,
		{
			cwd: path.resolve(),
			dir,
			force: true,
		},
	).catch((e) => console.error(e));

	spinner.stop("Downloaded example");

	clack.outro(`successfully downloaded example template to ${dir}`);
}

function cancel() {
	clack.cancel("Operation canceled");
	process.exit(0);
}
