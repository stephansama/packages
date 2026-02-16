import * as z from "zod";

import { createEnv } from "../dist/index.cjs";

export const envConfig = createEnv(
	z.object({
		GENERATIVE_API_KEY: z.string(),
		OTHER_SUPER_SECRET_KEY: z.string(),
	}),
);

export async function validateEnv() {
	return await envConfig.validate();
}
