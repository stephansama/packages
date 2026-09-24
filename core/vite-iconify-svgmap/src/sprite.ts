import type { IconifyJSON } from "@iconify/types";

import { getIconData } from "@iconify/utils/lib/icon-set/get-icon";
import { iconToSVG } from "@iconify/utils/lib/svg/build";
import { replaceIDs } from "@iconify/utils/lib/svg/id";

export interface Sprite {
	/** Requested icons that do not exist in the collection */
	missing: string[];
	svg: string;
}

/** Build an svg sprite with one `<symbol id="<icon>">` per icon */
export function generateSprite(
	collection: IconifyJSON,
	icons: Iterable<string>,
): Sprite {
	const missing: string[] = [];
	let symbols = "";

	for (const icon of [...new Set(icons)].toSorted()) {
		const data = getIconData(collection, icon);
		if (!data) {
			missing.push(icon);
			continue;
		}

		const { attributes, body } = iconToSVG(data);
		const scopedBody = replaceIDs(body, (id) => `${icon}-${id}`);
		symbols += `<symbol id="${icon}" viewBox="${attributes.viewBox}">${scopedBody}</symbol>`;
	}

	return {
		missing,
		svg: `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols}</svg>`,
	};
}
