import type { StandardSchemaV1 } from "@standard-schema/spec";

import * as React from "react";

import type { ListenerCallback, ValidatorMap } from "@/utils/types";

import { createEvent } from "./event";

export function useEventListener<Event extends ReturnType<typeof createEvent>>(
	event: Event,
	listener: Parameters<Event["listen"]>[0],
) {
	React.useEffect(() => {
		const cleanup = event.listen(listener);
		return () => cleanup();
	}, []);
}

/**
 * @param map - typed validated event map
 * @param listeners - map of listeners to add
 */
export function useListenerMap<
	Map extends ValidatorMap<EventMap>,
	EventMap extends Record<
		string,
		StandardSchemaV1
	> = Map extends ValidatorMap<infer EM> ? EM : never,
>(
	map: Map,
	listeners: {
		[K in keyof EventMap]?: ListenerCallback<
			StandardSchemaV1.InferInput<EventMap[K]>
		>;
	},
) {
	React.useEffect(() => {
		const cleaners: (() => void)[] = [];

		for (const [event, callback] of Object.entries(listeners)) {
			const cleaner = map.listen(
				event,
				callback as Parameters<(typeof map)["listen"]>[1],
			);
			cleaners.push(cleaner);
		}

		return () => {
			for (const cleaner of cleaners) {
				cleaner();
			}
		};
	}, []);
}
