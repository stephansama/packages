import * as singleFile from "../dist/index.cjs";

export async function useAPI() {
	const file = await singleFile.convertPageToSingleFile(
		"https://blog.stephansama.info",
	);

	console.info(file);
}
