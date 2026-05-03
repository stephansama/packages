import type { Package } from "@manypkg/get-packages";

import { downloadTemplate } from "@bluwy/giget-core";
import * as clack from "@clack/prompts";
import path from "node:path";

import rootPackageJson from "../../../package.json";
import fallbackExamples from "../../../scripts/dist/examples";

type RelativePackageJSON = Package["packageJson"] & {
	description: string;
	relativeDir: string;
};

export async function fetchExamples() {
	const url = new URL("meta.json", rootPackageJson.homepage).href;
	try {
		const response = await fetch(url);
		const json = await response.json();
		const examples = (json as RelativePackageJSON[]).filter(({ name }) => {
			return name.startsWith("@example");
		});

		if (examples.length === 0) {
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

	const exampleData = examples.find((current) => current.name === example);

	if (!exampleData) throw new Error("unable to find example data");

	const [, ...relativeDirectory] = exampleData.relativeDir.split("/");

	const defaultDirectory = "./" + relativeDirectory.join("-");

	const directory = await clack.text({
		defaultValue: defaultDirectory,
		message: "Input the directory to clone to:",
		placeholder: defaultDirectory,
	});

	if (clack.isCancel(directory)) return cancel();

	const spinner = clack.spinner();
	spinner.start("Downloading template");

	await downloadTemplate(
		`github:stephansama/packages/${exampleData.relativeDir}`,
		{
			cwd: path.resolve(),
			dir: directory,
			force: true,
		},
	).catch((error) => console.error(error));

	spinner.stop("Downloaded example");

	clack.outro(`successfully downloaded example template to ${directory}`);
}

function cancel() {
	clack.cancel("Operation canceled");
}
