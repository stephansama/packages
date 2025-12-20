import { z } from "zod";

export const zodUser = z.object({
	age: z.number().optional(),
	name: z.string(),
	tags: z.array(z.string()),
});
