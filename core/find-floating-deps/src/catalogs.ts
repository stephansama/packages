import * as fs from "node:fs";
import path from "node:path";
import * as yaml from "yaml";

/** Catalog name to dependency name to range, from `pnpm-workspace.yaml` */
export type Catalogs = Record<string, Record<string, string>>;

const catalogProtocolRegex = /^catalog:(?<name>.*)$/;

const defaultCatalog = "default";

type WorkspaceFile = {
	catalog?: Record<string, unknown>;
	catalogs?: Record<string, Record<string, unknown> | undefined>;
};

/**
 * The `catalog` and `catalogs` of `pnpm-workspace.yaml` in `rootDirectory`. The
 * top-level `catalog` is the `default` catalog. Returns no catalogs when the
 * file doesn't exist.
 */
export function readCatalogs(rootDirectory: string): Catalogs {
	const file = path.join(rootDirectory, "pnpm-workspace.yaml");
	if (!fs.existsSync(file)) return {};

	const workspace = (yaml.parse(fs.readFileSync(file, "utf8")) ??
		{}) as WorkspaceFile;

	const catalogs: Catalogs = {};
	for (const [name, entries] of Object.entries(workspace.catalogs ?? {})) {
		catalogs[name] = toRanges(entries);
	}
	catalogs[defaultCatalog] = {
		...catalogs[defaultCatalog],
		...toRanges(workspace.catalog),
	};

	return catalogs;
}

/**
 * The catalog a `catalog:` or `catalog:<name>` spec points at, and the range it
 * holds for `dependency`. `undefined` for other specs.
 */
export function resolveCatalogSpec(
	spec: string,
	dependency: string,
	catalogs: Catalogs,
): undefined | { catalog: string; range: string | undefined } {
	const name = catalogProtocolRegex.exec(spec.trim())?.groups?.name;
	if (name === undefined) return undefined;

	const catalog = name.trim() || defaultCatalog;
	const entries = catalogs[catalog];
	const range =
		entries && Object.hasOwn(entries, dependency)
			? entries[dependency]
			: undefined;

	return { catalog, range };
}

function toRanges(entries: Record<string, unknown> | undefined) {
	const ranges: Record<string, string> = {};
	for (const [dependency, range] of Object.entries(entries ?? {})) {
		if (typeof range === "string" || typeof range === "number") {
			ranges[dependency] = String(range);
		}
	}
	return ranges;
}
