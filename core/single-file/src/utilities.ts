export function bufferToDataUri(buffer: ArrayBuffer, mime?: null | string) {
	const base64 = Buffer.from(buffer).toString("base64");
	return `data:${mime || "image/png"};base64,${base64}`;
}

export function escapeScript(script: string) {
	return script
		.replaceAll("\\", "\\\\")
		.replaceAll("`", "\\`")
		.replaceAll("${", "\\${")
		.replaceAll("<script", String.raw`<\x73cript`)
		.replaceAll("</script>", String.raw`<\/script>`)
		.replaceAll("\n", String.raw`\n`)
		.replaceAll("\r", "");
}

const obviousQueries = ["\n", "{", "function"] as const;

// eslint-disable-next-line regexp/no-unused-capturing-group
const probablyUrlRegex = /(^https?:\/\/|\/|\.\/|\.\.\/|[\w\-./]+$)/;

export function isProbablyUrl(string_: string) {
	if (!string_ || obviousQueries.some((query) => query.includes(string_))) {
		return false;
	}

	// allow:
	// - absolute URLs
	// - root-relative (/foo.js)
	// - relative (./foo.js, foo.js)
	return probablyUrlRegex.test(string_);
}

export function isUrl(url: string, base: string) {
	if (!isProbablyUrl(url)) return false;
	try {
		return new URL(url, base).href;
	} catch (error) {
		console.error(`${url} is not a URL\n${String(error)}`);
		return false;
	}
}
