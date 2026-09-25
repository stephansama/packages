import { expect, it, vi } from "vitest";
import * as z from "zod";

import { createBroadcastEvent } from "@/broadcast-event";

it("dispatches the channel message properly", () => {
	const broadcast = createBroadcastEvent("broadcast-channel", {
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

	const firstChannel = createBroadcastEvent(channelName, schema);
	const secondChannel = createBroadcastEvent(channelName, schema);

	const postMessageSpy = vi.spyOn(firstChannel.channel, "postMessage");

	const firstCallback = vi.fn();
	const secondCallback = vi.fn();

	firstChannel.listen("reset", firstCallback);
	secondChannel.listen("reset", secondCallback);

	firstChannel.dispatch("reset", {});

	// the shared document event arrives synchronously; broadcast channel
	// delivery is asynchronous and can take more than a tick
	await vi.waitFor(() =>
		expect(secondCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: "message" }),
		),
	);

	expect(postMessageSpy).toHaveBeenCalled();
	expect(firstCallback).toHaveBeenCalled();
});
