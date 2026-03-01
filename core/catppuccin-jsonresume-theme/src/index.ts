import Handlebars from "handlebars";
import helpers from "handlebars-helpers";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

export function render(resume: string) {
	helpers({ handlebars: Handlebars });

	Handlebars.registerHelper("year", function (dateString) {
		if (!dateString) return "";
		return dateString.substring(0, 4);
	});

	Handlebars.registerHelper("formatDate", function (dateString) {
		if (!dateString) return "";
		return dateString.substring(0, 4);
	});

	const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
	const templatePath = path.join(__dirname, "../template/site.html.hbs");
	const template = fs.readFileSync(templatePath, "utf8");
	const compiledTemplate = Handlebars.compile(template);
	return compiledTemplate(resume);
}
