#!/usr/bin/env node

const cli = await import("./dist/cli.cjs");
await cli.run();
