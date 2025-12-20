import * as v from "valibot";

export const valibotUser = v.object({
	age: v.optional(v.number()),
	name: v.string(),
	tags: v.array(v.string()),
});
