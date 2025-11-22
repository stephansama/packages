import { expect, it, vi } from "vitest";
import * as z from "zod";

import { TypedBroadcastChannel } from "./broadcast";

it("dispatches the channel message properly", () => {
	const broadcast = new TypedBroadcastChannel("broadcast-channel", {
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
	const firstChannel = new TypedBroadcastChannel(channelName, schema);
	const secondChannel = new TypedBroadcastChannel(channelName, schema);
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
	expect(firstCallback).not.toHaveBeenCalled();
});
