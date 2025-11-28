import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import * as z from "zod";

import { createEvent } from "@/event";
import { createEventMap } from "@/event-map";
import { useListener, useListeners } from "@/react";

const event = createEvent("test-event", z.object({ payload: z.number() }));

function ExampleEventInteraction() {
	useListener(event, () => {
		console.info("called");
	});
	return (
		<>
			<button id="dispatch" onClick={() => event.dispatch({ payload: 67 })}>
				dispatch
			</button>
		</>
	);
}

it("sets up and listens for the event listener", () => {
	const addEventListenerSpy = vi.spyOn(event.target, "addEventListener");
	const dispatchEventSpy = vi.spyOn(event.target, "dispatchEvent");
	const infoSpy = vi.spyOn(console, "info");
	const result = render(<ExampleEventInteraction />);

	const button = result.getByRole("button");

	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(dispatchEventSpy).not.toHaveBeenCalled();
	expect(infoSpy).not.toHaveBeenCalled();

	fireEvent.click(button);

	expect(dispatchEventSpy).toHaveBeenCalled();
	expect(infoSpy).toHaveBeenCalledWith("called");
});

const eventMap = createEventMap("test-event-map", {
	set: z.object({
		value: z.enum(["light", "dark"]),
	}),
	toggle: z.object({}),
});

function ExampleEventMapInteraction() {
	useListeners(eventMap, {
		set: (payload) => console.info(payload.data.value),
		toggle: (_) => console.info("toggle"),
	});

	return (
		<>
			<button
				id="set-dark"
				onClick={() => eventMap.dispatch("set", { value: "dark" })}
			>
				set dark
			</button>
			<button
				id="set-light"
				onClick={() => eventMap.dispatch("set", { value: "light" })}
			>
				set light
			</button>
			<button id="toggle" onClick={() => eventMap.dispatch("toggle", {})}>
				toggle
			</button>
		</>
	);
}

it("sets up the event listener map", () => {
	const addEventListenerSpy = vi.spyOn(eventMap.target, "addEventListener");
	const dispatchEventSpy = vi.spyOn(eventMap.target, "dispatchEvent");
	const infoSpy = vi.spyOn(console, "info");
	const result = render(<ExampleEventMapInteraction />);

	const setDarkButton = result.getByRole("button", {
		name: /set dark/i,
	});

	const setLightButton = result.getByRole("button", {
		name: /set light/i,
	});

	const toggleButton = result.getByRole("button", {
		name: /toggle/i,
	});

	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(dispatchEventSpy).not.toHaveBeenCalled();
	expect(infoSpy).not.toHaveBeenCalled();

	fireEvent.click(toggleButton);
	expect(infoSpy).toHaveBeenCalledWith("toggle");

	fireEvent.click(setDarkButton);
	expect(infoSpy).toHaveBeenCalledWith("dark");

	fireEvent.click(setLightButton);
	expect(infoSpy).toHaveBeenCalledWith("light");

	expect(dispatchEventSpy).toHaveBeenCalledTimes(3);
});
