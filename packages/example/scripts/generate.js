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
	return {
		description: pkg.description,
		name: pkg.name,
		version: pkg.version,
	};
});

if (!fs.existsSync("./dist")) fs.mkdirSync("./dist");

fs.writeFileSync("./scripts/examples.json", JSON.stringify(exampleData));
