#!/usr/bin/env node

const CI = process.env.CI;
const isBuild = process.env.npm_lifecycle_event === "build";

const shouldRun = !CI && !isBuild;
const exitCode = shouldRun ? 0 : 1;

process.exit(exitCode);
