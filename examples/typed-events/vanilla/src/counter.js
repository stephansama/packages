import { TypedBroadcastChannel, TypedEvent } from "@stephansama/typed-events";
import * as z from "zod/v4/mini";

const broadcast = new TypedBroadcastChannel("update-controller", {
	update: z.object({
		current: z.number(),
	}),
});

const event = new TypedEvent(
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

	broadcast.listen("update", (message) => {
		setCounter(message.data.current);
	});

	event.listen((e) => {
		setCounter(e.detail.current);
	});

	element.addEventListener("click", () => {
		const next = counter + 1;
		event.dispatch({ current: next });
		broadcast.dispatch("update", { current: next });
	});

	setCounter(0);
}
