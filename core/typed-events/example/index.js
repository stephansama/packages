// remark-usage-ignore-next
/* eslint perfectionist/sort-modules: ["off"] */
// remark-usage-ignore-next
/* eslint perfectionist/sort-imports: ["off"] */
// remark-usage-ignore-next
import * as z from "zod";

// ### createEvent
//
//
// create a typed [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
// <details><summary>open example</summary>
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

// </details>

// ### createEventMap
//
// <details><summary>open example</summary>
import { createEventMap } from "../dist/index.cjs";

export const eventMap = createEventMap("event-map", {
	reset: z.object({}),
	update: z.object({ value: z.number() }),
});

// somewhere in your codebase
export function listenForEventMap() {
	const value = document.getElementById("value");

	const cleanup = eventMap.listen("update", (message) => {
		value.textContent = message.data.value;
	});

	return () => cleanup();
}

// somewhere else in your codebase
export function dispatchEventMap() {
	const button = document.getElementById("button");

	button.addEventListener("click", () => {
		eventMap.dispatch("update", {
			value: Math.floor(Math.random() * 100),
		});
	});
}

// </details>

// ### createBroadcastChannel
// create a typed [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/BroadcastChannel)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
//
// <details><summary>open example</summary>
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

// </details>

// ### createBroadcastEvent
// create a typed [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/BroadcastChannel)
// and [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
//
// <details><summary>open example</summary>
import { createBroadcastEvent } from "../dist/index.cjs";

export const broadcastEvent = createBroadcastEvent("broadcaster", {
	reset: z.object({}),
	update: z.object({ value: z.number() }),
});

// somewhere in your codebase
export function listenForBroadcastEvent() {
	const value = document.getElementById("value");

	const cleanup = broadcastEvent.listen("update", (message) => {
		value.textContent = message.data.value;
	});

	return () => cleanup();
}

// somewhere else in your codebase
export function dispatchBroadcastEvent() {
	const button = document.getElementById("button");

	button.addEventListener("click", () => {
		broadcastEvent.dispatch("update", {
			value: Math.floor(Math.random() * 100),
		});
	});
}

// </details>

// ### createMessage
// create a typed [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)
// using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator
//
// <details><summary>open example</summary>
import { createMessage } from "../dist/index.cjs";

export const message = createMessage("event-map", {
	reset: z.object({}),
	update: z.object({ value: z.number() }),
});

// somewhere in your codebase
export function listenForMessage() {
	const value = document.getElementById("value");

	const cleanup = message.listen("update", (message) => {
		value.textContent = message.data.value;
	});

	return () => cleanup();
}

// somewhere else in your codebase
export function dispatchMessage() {
	const button = document.getElementById("button");

	button.addEventListener("click", () => {
		message.dispatch("update", {
			value: Math.floor(Math.random() * 100),
		});
	});
}

// </details>

// ### React
// you can use `useListener` or `useListeners` to automatically register and cleanup typed event listeners
//
// <details><summary>open example</summary>
import { useListeners } from "../dist/react.cjs";

const map = createBroadcastEvent("react-example", {
	first: z.object({}),
	second: z.object({ payload: z.number() }),
});

export function ExampleComponent() {
	useListeners(map, {
		first: () => console.info("first event happened"),
		second: ({ data }) => console.info(data.payload),
	});

	return; // more jsx...
}

// </details>
