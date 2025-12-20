import type { StandardSchemaV1 } from "@standard-schema/spec";

export type HandlebarSchemaMapOptions = {
	path: string;
	schema: StandardSchemaV1;
};

import barhandles from "barhandles";
import Handlebars from "handlebars";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import * as normalize from "./normalize";
import { validate } from "./utils";

export function createHandlebarSchemaMap<
	Map extends Record<string, HandlebarSchemaMapOptions>,
>(
	map: Map,
	opts: { templateDirectory: string } = { templateDirectory: "./templates" },
) {
	return {
		async audit() {
			for (const item of Object.values(map)) {
				const file = await fsp.readFile(
					path.resolve(opts.templateDirectory, item.path),
					"utf8",
				);

				const handlebarSchema = barhandles.extractSchema(file);

				const errors = normalize.compareSchemas(
					normalize.handlebarSchema(handlebarSchema),
					normalize.standardSchema(item.schema)!,
				);

				if (errors.length) {
					throw new Error(
						`found the following errors comparing the schemas:\n\n${errors.join("\n")}\n\n`,
					);
				}

				console.info(`no issues found with ${item.path}`);
			}

			return true;
		},
		async compile<Key extends keyof Map & string>(
			template: Key,
			data: StandardSchemaV1.InferInput<(typeof map)[Key]["schema"]>,
		) {
			const file = await fsp.readFile(
				path.resolve(opts.templateDirectory, map[template].path),
				"utf8",
			);
			const compiled = Handlebars.compile(file);

			const schema = map[template].schema;

			await validate(schema, data);

			return compiled(data);
		},
		map,
	};
}
