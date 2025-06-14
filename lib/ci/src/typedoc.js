import fs from "node:fs";
import { $ as sh } from "zx";

import config from "../../../typedoc.json" with { type: "json" };
import latte from "../theme/latte.json" with { type: "json" };
import mocha from "../theme/mocha.json" with { type: "json" };

const css = String.raw;

const outputFilename = `../.${config.customCss}`;

/** @typedef {typeof mocha} Theme */

/** @typedef {keyof Theme} ThemeKey */

/** @typedef {'dark'|'light'} Variant */

/** @typedef {Record<string, ThemeKey>} VariableMap */

/* eslint-disable */
/** @type {VariableMap} */
const map = {
	"background": "Base",
	"background-secondary": "Mantle",
	"background-warning": "Yellow",
	"text": "Text",
	"contrast-text": "Subtext1",
	"text-aside": "Subtext0",
	"link": "Blue",
	"focus-outline": "Lavender",
	"ts-keyword": "Mauve",
	"ts-project": "Mauve",
	// "ts-module": 0,
	// "ts-namespace": 0,
	"ts-enum": "Yellow",
	// "ts-enum-member": 0,
	// "ts-variable": 0,
	"ts-function": "Lavender",
	"ts-class": "Sky",
	"ts-interface": "Green",
	// "ts-constructor": 0,
	"ts-property": "Peach",
	"ts-method": "Blue",
	"ts-reference": "Red",
	// "ts-call-signature": 0,
	// "ts-index-signature": 0,
	// "ts-constructor-signature": 0,
	"ts-parameter": "Red",
	// "ts-type-parameter": 0,
	"ts-accessor": "Red",
	// "ts-get-signature": 0,
	// "ts-set-signature": 0,
	"ts-type-alias": "Red",
	// "document": 0,
	"alert-note": "Blue",
	"alert-tip": "Green",
	"alert-important": "Mauve",
	"alert-warning": "Yellow",
	"alert-caution": "Red",
};
/* eslint-enable */

const lightVariables = buildVariables(map, latte, "light");
const darkVariables = buildVariables(map, mocha, "dark");

const file = css`
	@layer typedoc {
		${lightVariables}
		${darkVariables}
	}
`.trim();

fs.writeFileSync(outputFilename, file);

if (!process.env.CI) {
	await sh`prettier ${outputFilename} --write --ignore-path ./.prettierignore`;
}

/**
 * @param {VariableMap} inputMap
 * @param {Theme} theme
 * @param {Variant} variant
 */
function buildVariables(inputMap, theme, variant) {
	const prefix = `--${variant}-color-`;
	const variables = Object.entries(inputMap)
		.map(([variable, key]) => `${prefix}${variable}: ${theme[key]};`)
		.join("\n");
	return css`
		:root {
			${variables}
		}
	`;
}
