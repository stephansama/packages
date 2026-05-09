export async function getIcon(pack: string, name: string) {
	const onServer = typeof document === "undefined";
	const selectedPack = pack === "noto-emoji" ? "noto" : pack;

	if (!onServer) return `/${selectedPack}.svg#${name}`;

	const fs = await import("node:fs");

	const { LOADED_ICONS_FILENAME } = await import("./const");

	const current = fs.readFileSync(LOADED_ICONS_FILENAME, {
		encoding: "utf8",
		flag: "as+",
	});

	const currentRepresentation = JSON.parse(current || "{}") as Record<
		string,
		string[]
	>;
	const newPack = currentRepresentation[selectedPack]?.includes(name)
		? currentRepresentation[selectedPack]
		: [...new Set([name, ...(currentRepresentation[selectedPack] || [])])];

	const newRepresentation = {
		...currentRepresentation,
		[selectedPack]: newPack,
	};

	fs.writeFileSync(LOADED_ICONS_FILENAME, JSON.stringify(newRepresentation));
	return `/${selectedPack}.svg#${name}`;
}
