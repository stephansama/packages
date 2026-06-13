import * as url from "node:url";
import * as prettier from "prettier";

const prettierOptions = await prettier.resolveConfig(
	url.fileURLToPath(import.meta.url),
);

export async function format(
	input: string,
	filepath: string,
	options?: prettier.Options,
) {
	return await prettier.format(input, {
		filepath,
		...prettierOptions,
		...options,
	});
}
