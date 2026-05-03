#!/usr/bin/env node

const cli = await import("./dist/index.js");

await cli.run();
