// remark-usage-ignore-next
/* eslint perfectionist/sort-modules: ["off"] */
// remark-usage-ignore-next
/* eslint perfectionist/sort-imports: ["off"] */
import * as z from "zod";

// ### createEvent
// create a typed [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
import { createEvent } from "../dist/index.cjs";

export const customAnimationEvent = createEvent(
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
		item.style.x = event.data.x;
		item.style.y = event.data.y;
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

// ### createBroadcastChannel
// create a typed [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/BroadcastChannel)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
import { createBroadcastChannel } from "../dist/index.cjs";

export const channel = createBroadcastChannel("broadcaster", {
	reset: z.object({}),
	update: z.object({ value: z.number() }),
});

// somewhere in your codebase
export function listenForChannelMessage() {
	const value = document.getElementById("value");

	const cleanup = channel.listen("update", (message) => {
		value.textContent = message.data.value;
	});

	return () => cleanup();
}

// somewhere else in your codebase
export function dispatchChannelMessage() {
	const button = document.getElementById("button");

	button.addEventListener("click", () => {
		channel.dispatch("update", {
			value: Math.floor(Math.random() * 100),
		});
	});
}

// ### React
// you can use `useListener` or `useListeners` to automatically register and cleanup typed event listeners
import { createBroadcastEvent } from "../dist/index.cjs";
import { useListeners } from "../dist/react.cjs";

const broadcastEvent = createBroadcastEvent("react-example", {
	first: z.object({}),
	second: z.object({ payload: z.number() }),
});

export function ExampleComponent() {
	useListeners(broadcastEvent, {
		first: () => console.info("first event happened"),
		second: ({ data }) => console.info(data.payload),
	});

	return; // more jsx...
}
