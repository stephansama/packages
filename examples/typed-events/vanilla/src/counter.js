import {
	TypedBroadcastChannel,
	TypedBroadcastEvent,
	TypedEvent,
} from "@stephansama/typed-events";
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

const broadcastEvent = new TypedBroadcastEvent("theme", {
	set: z.object({ theme: z.enum(["light", "dark"]) }),
	toggle: z.object({}),
});

export function setupCounter(element) {
	let counter = 0;

	const [light, dark, toggle] = ["light", "dark", "toggle"].map((id) =>
		document.getElementById(id),
	);

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

	broadcastEvent.listen("set", (e) => {
		const payload = broadcastEvent.getPayload(e);
		const theme = document.getElementById("theme");
		theme.textContent = payload.theme;
	});

	broadcastEvent.listen("toggle", () => {
		const theme = document.getElementById("theme");
		theme.textContent = theme.textContent === "dark" ? "light" : "dark";
	});

	toggle.addEventListener("click", () => {
		broadcastEvent.dispatch("toggle", {});
	});

	dark.addEventListener("click", () => {
		broadcastEvent.dispatch("set", { theme: "dark" });
	});

	light.addEventListener("click", () => {
		broadcastEvent.dispatch("set", { theme: "light" });
	});

	element.addEventListener("click", () => {
		const next = counter + 1;
		event.dispatch({ current: next });
		broadcast.dispatch("update", { current: next });
	});

	setCounter(0);
}
