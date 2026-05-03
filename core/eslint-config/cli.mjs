#!/usr/bin/env node

const cli = await import("./dist/cli.mjs");
await cli.run();
