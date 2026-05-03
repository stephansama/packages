import type { StandardSchemaV1 } from "@standard-schema/spec";

import barhandles from "barhandles";
import Handlebars from "handlebars";
import * as fsp from "node:fs/promises";
import path from "node:path";

import * as normalize from "./normalize";
import { validate } from "./utilities";

export function createHandlebarSchemaSingleton<
	const Files extends readonly string[],
	Schema extends StandardSchemaV1,
	File = Files[number],
>(files: Files, schema: Schema, options?: { templateDirectory: string }) {
	options ??= { templateDirectory: "./templates" };

	return {
		async audit() {
			for (const filename of files) {
				const file = await fsp.readFile(
					path.join(options.templateDirectory, filename),
					"utf8",
				);

				const handlebarSchema = barhandles.extractSchema(file);

				const errors = normalize.compareSchemas(
					normalize.handlebarSchema(handlebarSchema),
					normalize.standardSchema(schema),
				);

				if (errors.length > 0) {
					throw new Error(
						`found the following errors comparing the schemas:\n\n${errors.join("\n")}\n\n`,
					);
				}

				console.info(`no issues found with ${filename}`);
			}

			return true;
		},
		async compile(
			template: File & string,
			data: StandardSchemaV1.InferInput<Schema>,
		) {
			const filename = path.resolve(options.templateDirectory, template);
			const file = await fsp.readFile(filename, "utf8");
			const compiled = Handlebars.compile(file);

			await validate(schema, data);

			return compiled(data);
		},
		files,
	};
}
