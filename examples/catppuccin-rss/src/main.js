import "./style.css";

const html = String.raw;

const themes = ["latte", "frappe", "macchiato", "mocha"];

document.querySelector("#app").innerHTML = html`
	<h1>Catppuccin x Pretty feed v3</h1>
	<div class="card">${themes.map(createButton).join("\n")}</div>
	<iframe src="./${themes.at(-1)}.xml" width="100%" height="100%"></iframe>
`;

function createButton(theme) {
	return html`<button id="${theme}" type="button">${theme}</button>`;
}

for (const theme of themes) {
	const element = document.getElementById(theme);
	if (!element) continue;
	element.addEventListener("click", () => {
		const iframe = document.querySelector("iframe");
		iframe.src = `./${theme}.xml`;

		const url = new URL(window.location.href);
		url.searchParams.set("theme", theme);
		window.history.pushState(url);
		// window.location.search = params;
	});
}
