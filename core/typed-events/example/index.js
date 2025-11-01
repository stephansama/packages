// remark-usage-ignore-next
/* eslint perfectionist/sort-modules: ["off"] */
import * as z from "zod";

import { TypedEvent } from "../dist/index.js";

export const customAnimationEvent = new TypedEvent(
	"custom-animation-event",
	z.object({
		x: z.number(),
		y: z.number(),
	}),
);

// somewhere in your codebase
export function listenForAnimationEvent() {
	const item = document.getElementById("item");

	const cleanup = customAnimationEvent.listen((event) => {
		item.style.x = event.detail.x;
		item.style.y = event.detail.y;
	});

	return () => cleanup();
}

// somewhere else in your codebase
export function dispatchEvent() {
	const x = document.getElementById("x");
	const y = document.getElementById("y");

	const button = document.getElementById("button");

	button.addEventListener("click", () => {
		customAnimationEvent.dispatch({
			x: +x.innerText,
			y: +y.innerText,
		});
	});
}
