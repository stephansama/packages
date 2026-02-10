// remark-usage-ignore-next
/* eslint perfectionist/sort-modules: ["off"] */
// remark-usage-ignore-next
/* eslint perfectionist/sort-imports: ["off"] */
// remark-usage-ignore-next
import * as z from "zod";

import { createApi } from "../dist/index.cjs";

const api = createApi({
	baseId: process.env.NOCODB_BASE!,
	origin: "https://nocodb.com",
	schema: z.object({
		column1: z.string(),
		column2: z.enum(["optionOne", "optionTwo", "optionThree"]),
		column3: z.number(),
		column4: z.boolean(),
	}),
	tableId: process.env.NOCODB_TABLE!,
	token: process.env.NOCODB_TOKEN,
});

export function callApi() {
	api.fetch({
		action: "LIST",
	});
}
