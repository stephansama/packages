export async function bufferToDataUri(
	buffer: ArrayBuffer,
	mime?: null | string,
) {
	const base64 = Buffer.from(buffer).toString("base64");
	return `data:${mime || "image/png"};base64,${base64}`;
}

export function escapeScript(script: string) {
	return script
		.replaceAll("\\", "\\\\")
		.replaceAll("`", "\\`")
		.replaceAll("${", "\\${")
		.replaceAll("<script", "<\\x73cript")
		.replaceAll("</script>", "<\\/script>")
		.replaceAll("\n", "\\n")
		.replaceAll("\r", "");
}

const obviousQueries = ["\n", "{", "function"] as const;

export function isProbablyUrl(str: string) {
	if (!str || obviousQueries.some((query) => query.includes(str))) {
		return false;
	}

	// allow:
	// - absolute URLs
	// - root-relative (/foo.js)
	// - relative (./foo.js, foo.js)
	return /^(https?:\/\/|\/|\.\/|\.\.\/|[a-zA-Z0-9_\-./]+$)/.test(str);
}

export function isUrl(url: string, base: string) {
	if (!isProbablyUrl(url)) return false;
	try {
		return new URL(url, base).href;
	} catch (error) {
		console.error(`${url} is not a URL\n${error}`);
		return false;
	}
}
