import { expect, it, vi } from "vitest";
import * as z from "zod";

import { createBroadcastChannel } from "@/broadcast";

it("dispatches the channel message properly", () => {
	const broadcast = createBroadcastChannel("broadcast-channel", {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	});
	const postMessageSpy = vi.spyOn(broadcast.channel, "postMessage");

	broadcast.dispatch("reset", {});

	expect(postMessageSpy).toHaveBeenCalled();
});

it("receives the channel message only on other channels", async () => {
	const schema = {
		reset: z.object({}),
		update: z.object({ value: z.number() }),
	};

	const channelName = "broadcast-channel";
	const firstChannel = createBroadcastChannel(channelName, schema);
	const secondChannel = createBroadcastChannel(channelName, schema);
	const postMessageSpy = vi.spyOn(firstChannel.channel, "postMessage");
	const firstCallback = vi.fn();
	const secondCallback = vi.fn();

	firstChannel.listen("reset", firstCallback);
	secondChannel.listen("reset", secondCallback);

	firstChannel.dispatch("reset", {});

	// broadcast channel delivery is asynchronous and can take more than a tick
	await vi.waitFor(() => expect(secondCallback).toHaveBeenCalled());

	expect(postMessageSpy).toHaveBeenCalled();
	expect(firstCallback).not.toHaveBeenCalled();
});
