import Handlebars from "handlebars";
import helpers from "handlebars-helpers";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

import type { ResumeSchema } from "./types";

export function render(resume: ResumeSchema) {
	helpers({ handlebars: Handlebars });

	Handlebars.registerHelper("formatDate", function (dateString) {
		if (!dateString) return "";
		return dateString.substring(0, 4);
	});

	const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
	const templateHtmlPath = path.join(__dirname, "../template/site.html.hbs");
	const templateCssPath = path.join(__dirname, "../dist-css/site.css");
	const templateHtml = fs.readFileSync(templateHtmlPath, "utf8");
	const templateCss = fs.readFileSync(templateCssPath, "utf8");
	const compiledTemplate = Handlebars.compile(templateHtml);
	return compiledTemplate({ ...resume, style: templateCss });
}
