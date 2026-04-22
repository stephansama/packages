import ky from "ky";
import path from "node:path";

export const WINDOW_KEY = "imports" as const;

export const importTypes = ["css", "font", "js", "unknown"] as const;
export type ImportType = (typeof importTypes)[number];

export const imports = new Map<
	string,
	{
		contentType: null | string;
		data: string;
		path?: string;
		type: ImportType;
	}
>();

export async function loadImport(file: string, dirname?: string) {
	const loaded = imports.get(file);
	if (loaded) return loaded.data;

	const resolvedFile = dirname ? path.join(dirname, file) : file;
	const response = await ky.get(resolvedFile);
	const data = await response.text();

	imports.set(file, {
		contentType: response.headers.get("Content-Type"),
		data,
		type: "unknown",
	});

	return data;
}
