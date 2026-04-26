#!/usr/bin/env node

import { generate } from "./generate-examples.js";

await generate({ writeToFile: false });
