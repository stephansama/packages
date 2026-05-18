#!/usr/bin/env node

import { generate } from "./generate";
import { run } from "./index";

const [subcommand, ...rest] = process.argv.slice(2);

await (subcommand === "generate" ? generate(rest) : run());
