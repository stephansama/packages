#!/usr/bin/env node

const cli = await import("./dist/index.cjs");
await cli.main();
