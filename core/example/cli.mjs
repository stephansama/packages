#!/usr/bin/env node

import { main } from "./dist/index.js";

main().then(
	() => {
		process.exit(0);
	},
	(error) => {
		if (error) console.error(error);
		process.exit(1);
	},
);
