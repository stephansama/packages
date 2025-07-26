import { flavors } from "@catppuccin/palette";
import * as fs from "node:fs";
import path from "node:path";

const css = String.raw;

const outputFilename = "./dist/catppuccin-typedoc.css";

/** @typedef {typeof flavors.mocha.colors} Theme */

/** @typedef {keyof Theme} ThemeKey */

/** @typedef {'dark'|'light'} Variant */

/** @typedef {Record<string, ThemeKey>} VariableMap */

/* eslint-disable */
/** @type {VariableMap} */
const map = {
	"background": "base",
	"background-secondary": "mantle",
	"background-warning": "yellow",
	"text": "text",
	"contrast-text": "subtext1",
	"text-aside": "subtext0",
	"link": "blue",
	"focus-outline": "lavender",
	"ts-keyword": "mauve",
	"ts-project": "mauve",
	// "ts-module": 0,
	// "ts-namespace": 0,
	"ts-enum": "yellow",
	// "ts-enum-member": 0,
	// "ts-variable": 0,
	"ts-function": "lavender",
	"ts-class": "sky",
	"ts-interface": "green",
	// "ts-constructor": 0,
	"ts-property": "peach",
	"ts-method": "blue",
	"ts-reference": "red",
	// "ts-call-signature": 0,
	// "ts-index-signature": 0,
	// "ts-constructor-signature": 0,
	"ts-parameter": "red",
	// "ts-type-parameter": 0,
	"ts-accessor": "red",
	// "ts-get-signature": 0,
	// "ts-set-signature": 0,
	"ts-type-alias": "red",
	// "document": 0,
	"alert-note": "blue",
	"alert-tip": "green",
	"alert-important": "mauve",
	"alert-warning": "yellow",
	"alert-caution": "red",
};
/* eslint-enable */

const lightVariables = buildVariables(map, flavors.latte.colors, "light");
const darkVariables = buildVariables(map, flavors.mocha.colors, "dark");

const file = css`
	@layer typedoc {
		${lightVariables}
		${darkVariables}
	}
`.trim();

const dir = path.dirname(outputFilename);

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputFilename, file, {
	flag: "as+",
});

/**
 * @param {VariableMap} inputMap
 * @param {Theme} theme
 * @param {Variant} variant
 */
function buildVariables(inputMap, theme, variant) {
	const prefix = `--${variant}-color-`;
	const variables = Object.entries(inputMap)
		.map(([variable, key]) => `${prefix}${variable}: ${theme[key].hex};`)
		.join("\n");
	return css`
		:root {
			${variables}
		}
	`;
}
