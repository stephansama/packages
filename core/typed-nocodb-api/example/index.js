// remark-usage-ignore-next
// eslint-disable-next-line zod/consistent-import
import * as z from "zod";

import { createApi } from "../dist/index.cjs";

const api = createApi({
	baseId: process.env.NOCODB_BASE,
	origin: "https://nocodb.com",
	schema: z.object({
		column1: z.string().trim(),
		column2: z.enum(["optionOne", "optionTwo", "optionThree"]),
		column3: z.number(),
		column4: z.boolean(),
	}),
	tableId: process.env.NOCODB_TABLE,
	token: process.env.NOCODB_TOKEN,
});

export async function callApi() {
	const response = await api.fetch({
		action: "LIST",
	});

	return response;
}
