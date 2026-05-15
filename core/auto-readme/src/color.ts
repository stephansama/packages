import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

export function getContrastText(color: string) {
	return colord(color).contrast("#ffffff") > colord(color).contrast("#000000")
		? "ffffff"
		: "000000";
}
