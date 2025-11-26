import { expect, it, vi } from "vitest";
import * as z from "zod";

import { TypedMessage } from "./message";

it("dispatches the message correctly", () => {
	const message = new TypedMessage("test-message", {
		toggle: z.object({}),
		update: z.object({
			value: z.number(),
		}),
	});

	const postMessageSpy = vi.spyOn(message.window, "postMessage");

	message.dispatch("update", { value: 67 });

	expect(postMessageSpy).toHaveBeenCalledWith(
		{ id: ["test-message", "update"].join(":"), value: 67 },
		message.window.origin,
	);
});

it("receives the message correctly", async () => {
	const message = new TypedMessage("test-message", {
		toggle: z.object({}),
		update: z.object({
			value: z.number(),
		}),
	});

	const postMessageSpy = vi.spyOn(message.window, "postMessage");
	const addEventListenerSpy = vi.spyOn(message.window, "addEventListener");
	const mockListener = vi.fn();
	message.listen("update", mockListener);
	message.dispatch("update", { value: 67 });

	// wait for message delivery in mock
	await new Promise((r) => setTimeout(r, 0));

	expect(postMessageSpy).toHaveBeenCalled();
	expect(addEventListenerSpy).toHaveBeenCalled();
	expect(mockListener).toHaveBeenCalled();
});
