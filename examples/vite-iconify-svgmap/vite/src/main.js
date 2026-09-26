import astro from "virtual:iconify-svgmap/logos/astro";
import vite from "virtual:iconify-svgmap/logos/vitejs";
import copilot from "virtual:iconify-svgmap/octicon/copilot-16";

// each import is the sprite href, e.g. `/assets/logos-<hash>.svg#astro`
document.querySelector("#app").innerHTML = [astro, vite, copilot]
	.map((href) => `<svg><use href="${href}"></use></svg>`)
	.join("");
