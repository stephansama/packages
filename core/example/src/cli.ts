#!/usr/bin/env node

import { main } from "./index.js";

main().then(
	() => {
		process.exit(0);
	},
	(error: unknown) => {
		if (error) console.error(error);
		process.exit(1);
	},
);
