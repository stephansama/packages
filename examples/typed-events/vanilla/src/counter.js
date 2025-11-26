import {
	TypedBroadcastChannel,
	TypedEvent,
	TypedMessage,
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

const message = new TypedMessage(
	"crossorigin",
	{
		toggle: z.object({}),
		update: z.object({
			value: z.number(),
		}),
	},
	["http://localhost:5174", "http://localhost:5173"],
);

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

	broadcast.listen("update", ({ isSelf, message }) => {
		setCounter(message.data.current);
		console.info({ isSelf, message });
	});

	event.listen((e) => {
		setCounter(e.detail.current);
	});

	broadcastEvent.listen("set", (e) => {
		const payload = broadcastEvent.getPayload(e);
		theme.textContent = payload.theme;
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
		// message.dispatch(
		// 	"toggle",
		// 	{},
		// 	{ origin: "http://localhost:5173", window: window.parent },
		// );
	});

	setCounter(0);
}
