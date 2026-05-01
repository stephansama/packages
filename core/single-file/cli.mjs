#!/usr/bin/env node

const cli = await import("./dist/cli.js");
await cli.run();
