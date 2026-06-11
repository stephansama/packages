#!/usr/bin/env node

import { cli } from "cleye";

import pkg from "../package.json";
import { fetchResponse } from "./index";

const arguments_ = cli({
	booleanFlagNegation: true,
	flags: {
		verbose: {
			alias: "v",
			default: false,
			type: Boolean,
		},
	},
	name: pkg.name.replace("@stephansama/", ""),
	parameters: ["<img>"],
	version: pkg.version,
});

console.info(await fetchResponse(arguments_._.img));
