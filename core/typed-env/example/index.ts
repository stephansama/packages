import * as z from "zod";

import { createEnvironment } from "../dist/index.mjs";

export const config = createEnvironment(
	z.object({
		GENERATIVE_API_KEY: z.string().trim(),
		OTHER_SUPER_SECRET_KEY: z.string().trim(),
	}),
);

export async function generateExample() {
	return await config.generateExample(".env.example");
}

export async function validateEnvironment() {
	return await config.validate();
}
