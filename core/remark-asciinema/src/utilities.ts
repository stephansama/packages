const html = String.raw;

export function constructAsciinemaImage(asciiSource: string) {
	return html`
		<a href="${asciiSource}" target="_blank" rel="noreferrer">
			<img src="${asciiSource}.svg" />
		</a>
	`;
}

export function constructAsciinemaScript(asciiSource: string) {
	const id = "asciicast-" + asciiSource.match(/[^/]+$/)?.at(0);
	const source = `${asciiSource}.js`;
	return html`<script async="true" id="${id}" src="${source}"></script>`;
}

export function getURL(input: string, condition = (url: URL) => url && true) {
	try {
		const url = new URL(input);
		return condition(url) && url;
	} catch {
		return false;
	}
}
