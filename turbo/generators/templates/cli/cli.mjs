#!/usr/bin/env node

"use strict";

import("./dist/index.js")
	.then((mod) => mod.run())
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
