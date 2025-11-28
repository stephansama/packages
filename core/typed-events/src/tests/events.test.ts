import { expect, it, vi } from "vitest";
import * as z from "zod";

import { TypedEvent } from "@/event";

it("dispatches an event with a valid event", () => {
	const event = new TypedEvent("test", z.object({ shape: z.number() }));

	const dispatchEventSpy = vi.spyOn(document, "dispatchEvent");

	expect(() => event.dispatch({ shape: 0 })).not.toThrowError();

	expect(dispatchEventSpy).toHaveBeenCalled();
});

it("prevents an event from being dispatched with an invalid event", () => {
	const event = new TypedEvent("test", z.object({ shape: z.number() }));

	// @ts-expect-error
	expect(() => event.dispatch({})).toThrowError();
});

it("listens for an event when the detail is valid", () => {
	const eventName = "test";
	const event = new TypedEvent(eventName, z.object({ shape: z.number() }));

	const addEventListenerSpy = vi.spyOn(document, "addEventListener");
	const consoleInfoSpy = vi.spyOn(console, "info");

	event.listen((event) => {
		console.info(event);
	});

	event.dispatch({ shape: 0 });

	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(consoleInfoSpy).toHaveBeenCalled();
});

it("warns when using an async validator", () => {
	const eventName = "test";
	const event = new TypedEvent(
		eventName,
		z.promise(z.object({ shape: z.number() })),
	);

	const addEventListenerSpy = vi.spyOn(document, "addEventListener");
	const consoleWarnSpy = vi.spyOn(console, "warn");

	event.listen((event) => {
		console.info(event);
	});

	event.dispatch({ shape: 0 });

	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
});

it("does not warn when using an async validator when silenceAsyncWarning is true", () => {
	const eventName = "test";
	const event = new TypedEvent(
		eventName,
		z.promise(z.object({ shape: z.number() })),
		{ silenceAsyncWarning: true },
	);

	const addEventListenerSpy = vi.spyOn(document, "addEventListener");
	const consoleWarnSpy = vi.spyOn(console, "warn");

	event.listen((event) => {
		console.info(event);
	});

	event.dispatch({ shape: 0 });

	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
});
