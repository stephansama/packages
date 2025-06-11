const html = String.raw;

export function constructAsciinemaImage(asciiSrc: string) {
	return html`
		<a href="${asciiSrc}" target="_blank" rel="noreferrer">
			<img src="${asciiSrc}.svg" />
		</a>
	`;
}

export function constructAsciinemaScript(asciiSrc: string) {
	const id = "asciicast-" + asciiSrc.match(/[^/]+$/)?.at(0);
	const src = `${asciiSrc}.js`;
	return html`<script async="true" id="${id}" src="${src}"></script>`;
}

export function getURL(str: string, condition = (url: URL) => url && true) {
	try {
		const url = new URL(str);
		return condition(url) && url;
	} catch {
		return false;
	}
}
