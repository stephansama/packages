import { flavors } from "@catppuccin/palette";
import * as fs from "node:fs";
import path from "node:path";

const css = String.raw;

const outputFilename = "./dist/catppuccin-typedoc.css";

type ColorMap = Record<string, keyof typeof flavors.mocha.colors>;

type Theme = "dark" | "light";

const map = {
	"alert-caution": "red",
	"alert-important": "mauve",
	"alert-note": "blue",
	"alert-tip": "green",
	"alert-warning": "yellow",
	"background": "base",
	"background-secondary": "mantle",
	"background-warning": "yellow",
	"contrast-text": "subtext1",
	"focus-outline": "lavender",
	"link": "blue",
	"text": "text",
	"text-aside": "subtext0",
	"ts-accessor": "red",
	"ts-class": "sky",
	"ts-enum": "yellow",
	"ts-function": "lavender",
	"ts-interface": "green",
	"ts-keyword": "mauve",
	"ts-method": "blue",
	"ts-parameter": "red",
	"ts-project": "mauve",
	"ts-property": "peach",
	"ts-reference": "red",
	"ts-type-alias": "red",
	// "ts-namespace": 0,
	// "ts-type-parameter": 0,
	// "document": 0,
	// "ts-module": 0,
	// "ts-enum-member": 0,
	// "ts-variable": 0,
	// "ts-call-signature": 0,
	// "ts-index-signature": 0,
	// "ts-constructor-signature": 0,
	// "ts-constructor": 0,
	// "ts-get-signature": 0,
	// "ts-set-signature": 0,
} satisfies ColorMap;

const lightVariables = buildVariables(map, flavors.latte.colors, "light");
const darkVariables = buildVariables(map, flavors.mocha.colors, "dark");

const file = css`
	@layer typedoc {
		${lightVariables}
		${darkVariables}
	}
`.trim();

const directory = path.dirname(outputFilename);

if (!fs.existsSync(directory)) {
	fs.mkdirSync(directory, { recursive: true });
}

fs.writeFileSync(outputFilename, file);

function buildVariables(
	inputMap: ColorMap,
	colors: typeof flavors.mocha.colors,
	theme: Theme,
) {
	const prefix = `--${theme}-color-`;
	const variables = Object.entries(inputMap)
		.map(([variable, key]) => `${prefix}${variable}: ${colors[key].hex};`)
		.join("\n");
	return css`
		:root {
			${variables}
		}
	`;
}
