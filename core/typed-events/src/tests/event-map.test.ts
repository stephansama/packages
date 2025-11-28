import { expect, it, vi } from "vitest";
import * as z from "zod";

import { createEventMap } from "@/event-map";

it("dispatches the event map message properly", () => {
	const broadcast = createEventMap("broadcast-channel", {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	});

	const dispatchEventSpy = vi.spyOn(broadcast.target, "dispatchEvent");

	broadcast.dispatch("reset", {});

	expect(dispatchEventSpy).toHaveBeenCalled();
});

it("receives the message", async () => {
	const schema = {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	};

	const channelName = "broadcast-channel";

	const firstChannel = createEventMap(channelName, schema);
	const secondChannel = createEventMap(channelName, schema);

	const dispatchEventSpy = vi.spyOn(firstChannel.target, "dispatchEvent");

	const firstCallback = vi.fn();
	const secondCallback = vi.fn();

	firstChannel.listen("reset", firstCallback);
	secondChannel.listen("reset", secondCallback);

	firstChannel.dispatch("reset", {});

	// wait for message delivery in mock
	await new Promise((r) => setTimeout(r, 0));

	expect(dispatchEventSpy).toHaveBeenCalled();
	expect(secondCallback).toHaveBeenCalled();
	expect(firstCallback).toHaveBeenCalled();
});
