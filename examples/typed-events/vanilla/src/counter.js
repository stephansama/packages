import { createEvent } from "@stephansama/typed-events";
import * as z from "zod/v4/mini";

const event = createEvent(
	"update-counter",
	z.object({
		current: z.number(),
	}),
);

export function setupCounter(element) {
	let counter = 0;

	function setCounter(count) {
		counter = count;
		element.innerHTML = `count is ${counter}`;
	}

	event.listen((e) => {
		setCounter(e.detail.current);
	});

	element.addEventListener("click", () => {
		event.dispatch({ current: counter + 1 });
	});

	setCounter(0);
}
