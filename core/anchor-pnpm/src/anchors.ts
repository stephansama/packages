import {
	Alias,
	Document,
	isAlias,
	isMap,
	isPair,
	isScalar,
	isSeq,
	Scalar,
	YAMLSeq,
} from "yaml";

const VERSIONS_KEY = "__versions";
const CATALOGS_KEY = "catalogs";

export type AnchorEntry = { name: string; value: string };

export type SyncProposal = {
	anchorName: string;
	catalog: string;
	keys: string[];
	version: string;
};

export function add(
	document: Document,
	name: string,
	value: string,
): { added: boolean } {
	const seq = ensureVersionsSeq(document);
	if (findAnchor(seq, name)) return { added: false };
	const scalar = new Scalar(value);
	scalar.anchor = name;
	seq.add(scalar);
	return { added: true };
}

export function applySyncProposal(
	document: Document,
	proposal: SyncProposal,
): void {
	add(document, proposal.anchorName, proposal.version);
	const catalogs = document.get(CATALOGS_KEY);
	if (!isMap(catalogs)) return;
	const group = catalogs.get(proposal.catalog);
	if (!isMap(group)) return;

	for (const entry of group.items) {
		if (!isPair(entry) || !isScalar(entry.key)) continue;
		if (!proposal.keys.includes(String(entry.key.value))) continue;
		entry.value = new Alias(proposal.anchorName);
	}
}

export function list(document: Document): AnchorEntry[] {
	const seq = getVersionsSeq(document);
	if (!seq) return [];
	const entries: AnchorEntry[] = [];
	for (const item of seq.items) {
		if (!isScalar(item) || !item.anchor) continue;
		entries.push({ name: item.anchor, value: String(item.value) });
	}
	return entries;
}

export function remove(
	document: Document,
	name: string,
	options: { force?: boolean } = {},
): { dangling: string[]; removed: boolean } {
	const seq = getVersionsSeq(document);
	if (!seq) return { dangling: [], removed: false };

	const dangling = collectAliasPaths(document, name);
	if (dangling.length > 0 && !options.force) {
		return { dangling, removed: false };
	}

	if (dangling.length > 0 && options.force) {
		const scalar = findAnchor(seq, name);
		replaceAliasesWithLiteral(document, name, scalar?.value);
	}

	const index = seq.items.findIndex(
		(item) => isScalar(item) && item.anchor === name,
	);
	if (index === -1) return { dangling: [], removed: false };
	seq.items.splice(index, 1);
	return { dangling: [], removed: true };
}

export function sync(document: Document): SyncProposal[] {
	const catalogs = document.get(CATALOGS_KEY);
	if (!isMap(catalogs)) return [];

	const proposals: SyncProposal[] = [];

	for (const pair of catalogs.items) {
		if (!isPair(pair) || !isScalar(pair.key) || !isMap(pair.value))
			continue;
		const catalogName = String(pair.key.value);
		const versionToKeys = new Map<string, string[]>();

		for (const entry of pair.value.items) {
			if (!isPair(entry) || !isScalar(entry.key)) continue;
			const value = entry.value;
			if (!isScalar(value) || value.anchor) continue;
			const versionString = String(value.value);
			const keyString = String(entry.key.value);
			versionToKeys.set(versionString, [
				...(versionToKeys.get(versionString) ?? []),
				keyString,
			]);
		}

		for (const [version, keys] of versionToKeys) {
			if (keys.length < 2) continue;
			proposals.push({
				anchorName: catalogName,
				catalog: catalogName,
				keys,
				version,
			});
		}
	}

	return proposals;
}

export function update(
	document: Document,
	name: string,
	value: string,
): { updated: boolean } {
	const seq = getVersionsSeq(document);
	if (!seq) return { updated: false };
	const scalar = findAnchor(seq, name);
	if (!scalar) return { updated: false };
	scalar.value = value;
	return { updated: true };
}

function collectAliasPaths(document: Document, name: string): string[] {
	const paths: string[] = [];
	function walk(node: unknown, trail: string[]): void {
		if (isAlias(node)) {
			if (node.source === name) paths.push(trail.join(".") || "(root)");
			return;
		}
		if (isMap(node)) {
			for (const pair of node.items) {
				if (!isPair(pair) || !isScalar(pair.key)) continue;
				walk(pair.value, [...trail, String(pair.key.value)]);
			}
			return;
		}
		if (isSeq(node)) {
			let index = 0;
			for (const item of node.items) {
				walk(item, [...trail, String(index++)]);
			}
		}
	}
	walk(document.contents, []);
	return paths;
}

function ensureVersionsSeq(document: Document): YAMLSeq {
	const existing = getVersionsSeq(document);
	if (existing) return existing;
	const seq = new YAMLSeq();
	document.set(VERSIONS_KEY, seq);
	return seq;
}

function findAnchor(seq: YAMLSeq, name: string): Scalar | undefined {
	for (const item of seq.items) {
		if (isScalar(item) && item.anchor === name) return item;
	}
	return undefined;
}

function getVersionsSeq(document: Document): undefined | YAMLSeq {
	const node = document.get(VERSIONS_KEY);
	return isSeq(node) ? node : undefined;
}

function replaceAliasesWithLiteral(
	document: Document,
	name: string,
	literal: unknown,
): void {
	function visit(node: unknown): void {
		if (isMap(node)) {
			for (const pair of node.items) {
				if (!isPair(pair)) continue;
				if (isAlias(pair.value) && pair.value.source === name) {
					pair.value = new Scalar(literal);
				} else {
					visit(pair.value);
				}
			}
			return;
		}
		if (isSeq(node)) {
			for (let index = 0; index < node.items.length; index++) {
				const item = node.items[index];
				if (isAlias(item) && item.source === name) {
					node.items[index] = new Scalar(literal);
				} else {
					visit(item);
				}
			}
		}
	}
	visit(document.contents);
}
