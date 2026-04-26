import ky from "ky";
import path from "node:path";

import * as utilities from "./utilities";

export const WINDOW_KEY = "imports" as const;

export const importTypes = ["css", "font", "js", "binary", "unknown"] as const;
export type ImportType = (typeof importTypes)[number];

export const imports = new Map<
	string,
	{
		contentType: null | string;
		data: ArrayBuffer | string;
		path?: string;
		type: ImportType;
	}
>();

export type LoadImportArgs = { dirname?: string; file: string };

export function determineImportType(contentType?: null | string): ImportType {
	switch (contentType) {
		case "application/ecmascript":
		case "application/javascript":
		case "text/ecmascript":
		case "text/javascript":
			return "js";
		default:
			return "unknown";
	}
}

export async function loadImport(
	args: LoadImportArgs & { isBinary: true },
): Promise<ArrayBuffer>;
export async function loadImport(
	args: LoadImportArgs & { isBinary?: false },
): Promise<string>;

export async function loadImport({
	dirname,
	file,
	isBinary,
}: {
	dirname?: string;
	file: string;
	isBinary?: boolean;
}): Promise<ArrayBuffer | string> {
	const loaded = imports.get(file);
	if (loaded) {
		if (isBinary && loaded.data instanceof ArrayBuffer) return loaded.data;
		if (!isBinary && typeof loaded.data === "string") return loaded.data;
	}

	const resolvedFile = dirname ? path.join(dirname, file) : file;
	const response = await ky.get(resolvedFile);
	const contentType = response.headers.get("Content-Type");

	if (isBinary) {
		const buffer = await response.arrayBuffer();
		imports.set(file, { contentType, data: buffer, type: "binary" });
		return buffer;
	}

	const text = await response.text();
	const importType = determineImportType(contentType);
	imports.set(file, { contentType, data: text, type: importType });
	return text;
}

export async function writeImportMap() {
	const registryImports = imports
		.entries()
		.filter(([_, entry]) => entry.type === "js")
		.map(([file, source]) => {
			if (typeof source.data !== "string") {
				throw new Error(
					`source is not of type string (shouldn't happen)`,
				);
			}

			const escaped = utilities.escapeScript(source.data);
			return (
				'"' +
				file +
				'": URL.createObjectURL(new Blob([`' +
				escaped +
				"`], {type: 'text/javascript'}))"
			);
		});

	const registryString = Array.from(registryImports).join("\n");

	return `<script type="module">\nwindow.registry = {\n${registryString}\n};\n</script>`;
}
