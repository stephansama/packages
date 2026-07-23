import { defineRule, type Error } from "@stephansama/monorule";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";

import type rootTsconfig from "../../tsconfig.json";
import type tsconfig from "../../tsconfig.root.json";

import { format } from "../utilities/prettier";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const rootTsconfigPath = path.join(dirname, "../../tsconfig.json");
const rootTsconfigFile = await fs.promises.readFile(rootTsconfigPath, "utf8");
const rootTsconfigJson = JSON.parse(rootTsconfigFile) as typeof rootTsconfig;

export const verifyTsconfig = defineRule({
	async apply(input, context) {
		if (!context?.errors) return input;

		for (const error of context.errors) {
			switch (error.id) {
				case "missing_from_root_tsconfig": {
					rootTsconfigJson.references.push({
						path: `./${context.relativePath}`,
					});

					rootTsconfigJson.references.sort((a, b) => {
						return a.path.localeCompare(b.path);
					});

					const file = await format(
						JSON.stringify(rootTsconfigJson),
						"tsconfig.json",
						{ useTabs: false },
					);

					await fs.promises.writeFile(rootTsconfigPath, file, "utf8");

					break;
				}

				case "no_composite": {
					input.compilerOptions ??= {};
					input.compilerOptions.composite = true;
					break;
				}
			}
		}

		return input;
	},
	errors: {
		missing_from_root_tsconfig: `missing tsconfig from root tsconfig reference list`,
		no_composite: "missing composite key",
	},
	exclude: ["tsconfig.json", "turbo/**/tsconfig.json"],
	include: ["**/tsconfig.json", "tsconfig.root.json"],
	name: "verify-tsconfigs",
	parse: (input: string) =>
		JSON.parse(input) as Omit<typeof tsconfig, "compilerOptions"> & {
			compilerOptions: Partial<(typeof tsconfig)["compilerOptions"]>;
		},
	stringify(input) {
		return format(JSON.stringify(input), "tsconfig.json", { useTabs: false });
	},
	when(input, context) {
		const errors = new Array<Error<keyof typeof this.errors>>();

		if (
			!rootTsconfigJson.references.some(
				(reference) => reference.path === `./${context?.relativePath}`,
			)
		) {
			errors.push({ id: "missing_from_root_tsconfig" });
		}

		if (!input?.compilerOptions?.composite) {
			errors.push({ id: "no_composite", message: this.errors.no_composite });
		}

		return errors;
	},
});
