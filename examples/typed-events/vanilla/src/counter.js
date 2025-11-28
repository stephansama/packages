import {
	createBroadcastChannel,
	createBroadcastEvent,
	createMessage,
	TypedEvent,
} from "@stephansama/typed-events";
import * as z from "zod/v4/mini";

const broadcast = createBroadcastChannel("update-controller", {
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

const broadcastEvent = createBroadcastEvent("theme", {
	set: z.object({ theme: z.enum(["light", "dark"]) }),
	toggle: z.object({}),
});

const message = createMessage("crossorigin", {
	toggle: z.object({}),
	update: z.object({
		value: z.number(),
	}),
});

export function setupCounter(element) {
	let counter = 0;
	const theme = document.getElementById("theme");
	const [light, dark, toggle] = ["light", "dark", "toggle"].map((id) =>
		document.getElementById(id),
	);

	function setCounter(count) {
		counter = count;
		element.innerHTML = `count is ${counter}`;
	}

	broadcast.listen("update", ({ data, type }) => {
		console.log("setting ", type);
		setCounter(data.current);
	});

	event.listen((e) => {
		setCounter(e.detail.current);
	});

	broadcastEvent.listen("set", ({ data, type }) => {
		console.log("setting ", type);
		theme.textContent = data.theme;
	});

	broadcastEvent.listen("toggle", () => {
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

	message.listen("toggle", () => {
		const img = document.querySelector("img");

		img.src =
			img.src !== "https://api.iconify.design/logos:neovim.svg"
				? "https://api.iconify.design/logos:neovim.svg"
				: "https://api.iconify.design/logos:vitejs.svg";
	});

	message.window = window.parent;

	const img = document.querySelector("img");

	img.addEventListener("click", () => {
		message.dispatch(
			"update",
			{
				value: 67,
			},
			{ origin: "http://localhost:5173", window: window.parent },
		);
	});

	element.addEventListener("click", () => {
		const next = counter + 1;
		event.dispatch({ current: next });
		broadcast.dispatch("update", { current: next });
		message.dispatch(
			"toggle",
			{},
			{ origin: "http://localhost:5173", window: window.parent },
		);
	});

	setCounter(0);
}
