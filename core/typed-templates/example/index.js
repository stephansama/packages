import * as z from "zod";

import { createHandlebarSchemaMap, getFileContext } from "../dist/index.js";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

export const schema = createHandlebarSchemaMap(
	{
		constList: {
			path: "../tests/fixtures/map/const-list.ts.hbs",
			schema: z.object({
				body: z.unknown(),
				name: z.string(),
				plural_name: z.string(),
			}),
		},
		constMap: {
			path: "../tests/fixtures/map/const-map.ts.hbs",
			schema: z.object({
				items: z.array(
					z.object({
						key: z.string(),
						value: z.unknown(),
					}),
				),
				map_type: z.string(),
				name: z.string(),
			}),
		},
	},
	{ templateDirectory },
);

if (isLinting()) await schema.audit();

// then later on in the code in another file:
