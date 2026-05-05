#!/usr/bin/env node

const cli = await import("./dist/index.mjs");

await cli.run();
