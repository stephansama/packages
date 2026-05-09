#!/usr/bin/env node

import { getPackages } from "@manypkg/get-packages";
import * as fs from "node:fs";
import path from "node:path";

const { packages } = await getPackages(process.cwd());

const www = packages.find((pkg) => pkg.packageJson.name === "www");
if (!www) throw new Error("unable to find package website");

const sidebarPath = path.join(www.dir, "./api/typedoc-sidebar.json");
const sidebarFile = await fs.promises.readFile(sidebarPath, "utf8");
const sidebarJson = JSON.parse(sidebarFile) as { text: string }[];
const updatedSidebar = sidebarJson.map((current) => ({
	...current,
	text: current.text.replace("@stephansama/", ""),
}));

const updatedSidebarFile = JSON.stringify(updatedSidebar);
await fs.promises.writeFile(sidebarPath, updatedSidebarFile, "utf8");

console.info(updatedSidebar);
