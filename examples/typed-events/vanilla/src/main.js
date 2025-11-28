import { setupCounter } from "./counter.js";
import "./style.css";

const html = String.raw;

document.querySelector("#app").innerHTML = html`
	<div>
		<img
			src="https://api.iconify.design/logos:vitejs.svg"
			class="logo"
			alt="Vite logo"
		/>
		<h1>Hello Vite!</h1>
		<div class="card">
			<button id="counter" type="button"></button>
		</div>
		<div style="display:flex; gap:8px;align-items:center;">
			<div id="theme">dark</div>
			<button id="light">set light</button>
			<button id="toggle">toggle</button>
			<button id="dark">set dark</button>
		</div>
		<button id="current">Current</button>
	</div>
`;

setupCounter(document.querySelector("#counter"));
