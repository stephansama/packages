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

export function isProbablyUrl(str: string) {
	if (!str) return false;

	// reject obvious non-URLs
	if (str.includes("\n") || str.includes("{") || str.includes("function")) {
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

export function str2ab(str: string) {
	const array = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		array[i] = str.charCodeAt(i);
	}
	return array.buffer;
}
