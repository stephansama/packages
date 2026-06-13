import type { Error } from "@stephansama/monorule";

import { defineRule } from "@stephansama/monorule";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";
import * as prettier from "prettier";
import * as z from "zod";

const currentFile = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(currentFile);
const nodeVersionPath = path.resolve(dirname, "../../.node-version");
const nodeVersionFile = await fs.promises.readFile(nodeVersionPath, "utf8");
const prettierOptions = await prettier.resolveConfig(currentFile);

const GIT_REPO_URL = "https://github.com/stephansama/packages" as const;
const NODE_ENGINE =
	`>=${Number(nodeVersionFile.split(".").at(0)?.replaceAll(/\D/g, ""))}` as const;

export const verifyPublishedPackageJson = defineRule({
	apply(input, context) {
		if (!context?.errors) return;

		for (const error of context.errors) {
			switch (error.id) {
				case "author": {
					input.author = {
						email: "stephanrandle.dev@gmail.com",
						name: "Stephan Randle",
						url: `https://stephansama.info`,
					};
					break;
				}

				case "bug": {
					input.bugs = { url: `${GIT_REPO_URL}/issues` };
					break;
				}

				case "homepage": {
					input.homepage = `https://packages.stephansama.info/api/${context?.closestPackage.json?.name}`;
					break;
				}

				case "repository": {
					input.repository = {
						directory: context?.relativePath,
						type: "git",
						url: `git+${GIT_REPO_URL}.git`,
					};
					break;
				}
			}
		}

		return input;
	},
	errors: {
		author: "missing author block",
		bug: "missing bug object from package.json",
		engines: "missing valid engines block",
		homepage: "missing homepage link",
		repository: "missing repository block",
	},
	include: "**/core/**/package.json",
	name: "verify-published-package-json",
	parse: (input: string) =>
		z
			.looseObject({
				author: z
					.object({
						email: z.string().trim(),
						name: z.string().trim(),
						url: z.string().trim(),
					})
					.optional(),
				bugs: z.object({ url: z.string().trim() }).optional(),
				engines: z.object({ node: z.string().trim() }).optional(),
				homepage: z.string().trim().optional(),
				repository: z
					.object({
						directory: z.string().trim().optional(),
						type: z.literal("git"),
						url: z.string().trim(),
					})
					.optional(),
			})
			.parse(JSON.parse(input)),
	async stringify(input) {
		return await prettier.format(JSON.stringify(input), {
			filepath: "package.json",
			...prettierOptions,
			useTabs: false,
		});
	},
	when(input, context) {
		const errors = new Array<Error<keyof typeof this.errors>>();

		if (
			!input.homepage ||
			input.homepage !==
				`https://packages.stephansama.info/api/${context?.closestPackage.json?.name}`
		) {
			errors.push({ id: "homepage", message: this.errors.homepage });
		}

		if (!input.engines || input.engines.node !== NODE_ENGINE) {
			errors.push({ id: "engines", message: this.errors.engines });
		}

		if (!input.repository) {
			errors.push({ id: "repository", message: this.errors.repository });
		}

		if (!input.author) {
			errors.push({ id: "author", message: this.errors.author });
		}

		if (!input.bugs) {
			errors.push({ id: "bug", message: this.errors.bug });
		}

		return errors;
	},
});
