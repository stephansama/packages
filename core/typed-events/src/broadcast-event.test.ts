import { expect, it, vi } from "vitest";
import * as z from "zod";

import { createTypedBroadcastEvent } from "./broadcast-event";

it("dispatches the channel message properly", () => {
	const broadcast = createTypedBroadcastEvent("broadcast-channel", {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	});

	const postMessageSpy = vi.spyOn(broadcast.channel, "postMessage");
	const dispatchEventSpy = vi.spyOn(broadcast.target, "dispatchEvent");

	broadcast.dispatch("reset", {});

	expect(postMessageSpy).toHaveBeenCalled();
	expect(dispatchEventSpy).toHaveBeenCalled();
});

it("receives the message on the sender and receiver channels", async () => {
	const schema = {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	};

	const channelName = "broadcast-channel";

	const firstChannel = createTypedBroadcastEvent(channelName, schema);
	const secondChannel = createTypedBroadcastEvent(channelName, schema);

	const postMessageSpy = vi.spyOn(firstChannel.channel, "postMessage");

	const firstCallback = vi.fn();
	const secondCallback = vi.fn();

	firstChannel.listen("reset", firstCallback);
	secondChannel.listen("reset", secondCallback);

	firstChannel.dispatch("reset", {});

	// wait for message delivery in mock
	await new Promise((r) => setTimeout(r, 0));

	expect(postMessageSpy).toHaveBeenCalled();
	expect(secondCallback).toHaveBeenCalled();
	expect(firstCallback).toHaveBeenCalled();
});
