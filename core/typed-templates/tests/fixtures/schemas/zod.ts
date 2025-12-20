import * as z from "zod";

export const zodUserSchema = z.object({
	age: z.number().optional(),
	name: z.string(),
	tags: z.array(z.string()),
});
