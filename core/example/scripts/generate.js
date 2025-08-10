#!/usr/bin/env node

import fs from "node:fs";
import { $ as sh } from "zx";

const exampleList = await sh`pnpm list --filter '@example*'`;

const examples = exampleList.stdout
	.split("\n")
	.filter((line) => line.startsWith("@example"))
	.map((line) => line.substring(0, line.lastIndexOf("@")))
	.map((example) => example.replace("@example", "examples"));

const exampleData = examples.map((example) => {
	const path = `../../${example}/package.json`;
	const file = fs.readFileSync(path, { encoding: "utf-8" });
	const pkg = JSON.parse(file);
	const { description, name, version } = pkg;
	return { description, name, version };
});

if (!fs.existsSync("./dist")) fs.mkdirSync("./dist");

fs.writeFileSync("./dist/examples.json", JSON.stringify(exampleData));
