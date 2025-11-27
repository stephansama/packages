import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { Id } from "./id";

export interface ValidatorMap<
	EventMap extends Record<string, StandardSchemaV1>,
> {
	dispatch<
		EventName extends keyof EventMap & string,
		Input extends object & StandardSchemaV1.InferInput<EventMap[EventName]>,
	>(
		name: EventName,
		input: Input,
	): void;

	listen<
		Event extends keyof EventMap & string,
		Input extends object & StandardSchemaV1.InferInput<EventMap[Event]>,
	>(
		name: Event,
		callback: <Type extends EventType>(payload: {
			data: Input;
			raw: RawEvent<Type, Input>;
			type: Type;
		}) => void,
	): void;

	map: EventMap;
	name: string;
}

type EventType = "event" | "message";

type RawEvent<Type extends EventType, Shape> = Type extends "event"
	? CustomEvent<Shape>
	: MessageEvent<Shape>;
