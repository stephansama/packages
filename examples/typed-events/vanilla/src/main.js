import { setupCounter } from "./counter.js";
import "./style.css";

const html = String.raw;

document.querySelector("#app").innerHTML = html`
	<div>
		<a href="https://vite.dev" target="_blank">
			<img
				src="https://api.iconify.design/logos:vitejs.svg"
				class="logo"
				alt="Vite logo"
			/>
		</a>
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
			target="_blank"
		>
			<img
				src="https://api.iconify.design/logos:javascript.svg"
				class="logo vanilla"
				alt="JavaScript logo"
			/>
		</a>
		<h1>Hello Vite!</h1>
		<div class="card">
			<button id="counter" type="button"></button>
		</div>
		<button id="current">Current</button>
	</div>
`;

setupCounter(document.querySelector("#counter"));
