#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";

const { packages } = await getPackages(process.cwd());

console.info(JSON.stringify(packages.map((pkg) => pkg.packageJson)));
