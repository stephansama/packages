import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { Id } from "./id";

export type ListenerCallback<Input> = _ListenerCallback<
	Input,
	keyof RawEventMap<Input>
>;

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
		callback: ListenerCallback<Input>,
	): void;

	map: EventMap;
	name: string;
}

type _ListenerCallback<
	Input,
	Type extends keyof RawEventMap<Input>,
	Payload = { data: Input; raw: RawEvent<Type, Input>; type: Type },
> = (payload: Payload) => void;

type RawEvent<
	Type extends keyof RawEventMap<Shape>,
	Shape,
> = RawEventMap<Shape>[Type];

type RawEventMap<Shape> = {
	event: CustomEvent<Shape>;
	message: MessageEvent<Shape>;
};
