#!/usr/bin/env node

import { PublishError, run } from "./index";

try {
	await run();
} catch (error) {
	// failed platforms were already logged, so print the summary without a stack
	if (!(error instanceof PublishError)) throw error;
	console.error(error.message);
	process.exitCode = 1;
}
