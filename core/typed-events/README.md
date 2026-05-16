<div align="center">

# [`@stephansama`](https://github.com/stephansama) / typed-events

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-events)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-events)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ftyped-events?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-events)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/typed-events)](https://socket.dev/npm/package/@stephansama/typed-events/overview)
[![jsr](https://jsr.io/badges/@stephansama/typed-events)](https://jsr.io/@stephansama/typed-events)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-events?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-events)

[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![react](https://img.shields.io/badge/react-19.2.0-61DAFB.svg?logo=react&logoColor=ffffff&labelColor=61DAFB)](https://npmx.dev/package/react)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)

<!-- BADGE end -->

</div>

Typed events store using standard schema

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [createEvent](#createevent)
  - [createEventMap](#createeventmap)
  - [createBroadcastChannel](#createbroadcastchannel)
  - [createBroadcastEvent](#createbroadcastevent)
  - [createMessage](#createmessage)
  - [React](#react)
- [References](#references)

</details>

## Installation

```sh
pnpm install @stephansama/typed-events
```

## Usage

### createEvent

create a typed [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator

<details><summary>open example</summary>

```typescript
import { createEvent } from "@stephansama/typed-events";

export const customAnimationEvent = createEvent(
  "custom-animation-event",
  z.object({
    x: z.number(),
    y: z.number(),
  }),
);
```

somewhere in your codebase

```typescript
export function listenForAnimationEvent() {
  const item = document.querySelector<HTMLElement>("#item");

  if (!item) throw new Error("unable to find item");

  const cleanup = customAnimationEvent.listen((event) => {
    item.style.x = String(event.data.x);
    item.style.y = String(event.data.y);
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```typescript
export function dispatchEvent() {
  const button = document.querySelector("#button");
  const x = document.querySelector("#x");
  const y = document.querySelector("#y");

  if (!button) throw new Error("unable to find button");
  if (!x) throw new Error("unable to find x");
  if (!y) throw new Error("unable to find y");

  button.addEventListener("click", () => {
    customAnimationEvent.dispatch({
      x: +x.textContent,
      y: +y.textContent,
    });
  });
}
```

</details>

### createEventMap

<details><summary>open example</summary>

```typescript
import { createEventMap } from "@stephansama/typed-events";

export const eventMap = createEventMap("event-map", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```typescript
export function listenForEventMap() {
  const value = document.querySelector("#value");
  if (!value) throw new Error("unable to find value");

  const cleanup = eventMap.listen("update", (message) => {
    value.textContent = String(message.data.value);
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```typescript
export function dispatchEventMap() {
  const button = document.querySelector("#button");
  if (!button) throw new Error("unable to find button");

  button.addEventListener("click", () => {
    eventMap.dispatch("update", {
      value: Math.floor(Math.random() * 100),
    });
  });
}
```

</details>

### createBroadcastChannel

create a typed [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/BroadcastChannel)
using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator

<details><summary>open example</summary>

```typescript
import { createBroadcastChannel } from "@stephansama/typed-events";

export const channel = createBroadcastChannel("broadcaster", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```typescript
export function listenForChannelMessage() {
  const value = document.querySelector("#value");
  if (!value) throw new Error("unable to find value");

  const cleanup = channel.listen("update", (message) => {
    value.textContent = String(message.data.value);
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```typescript
export function dispatchChannelMessage() {
  const button = document.querySelector("#button");
  if (!button) throw new Error("unable to find button");

  button.addEventListener("click", () => {
    channel.dispatch("update", {
      value: Math.floor(Math.random() * 100),
    });
  });
}
```

</details>

### createBroadcastEvent

create a typed [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/BroadcastChannel)
and [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator

<details><summary>open example</summary>

```typescript
import { createBroadcastEvent } from "@stephansama/typed-events";

export const broadcastEvent = createBroadcastEvent("broadcaster", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```typescript
export function listenForBroadcastEvent() {
  const value = document.querySelector("#value");
  if (!value) throw new Error("unable to find value");

  const cleanup = broadcastEvent.listen("update", (message) => {
    value.textContent = String(message.data.value);
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```typescript
export function dispatchBroadcastEvent() {
  const button = document.querySelector("#button");
  if (!button) throw new Error("unable to find button");

  button.addEventListener("click", () => {
    broadcastEvent.dispatch("update", {
      value: Math.floor(Math.random() * 100),
    });
  });
}
```

</details>

### createMessage

create a typed [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)
using a [standard-schema](https://github.com/standard-schema/standard-schema) compatible validator

<details><summary>open example</summary>

```typescript
import { createMessage } from "@stephansama/typed-events";

export const message = createMessage("event-map", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```typescript
export function listenForMessage() {
  const value = document.querySelector("#value");
  if (!value) throw new Error("unable to find value");

  const cleanup = message.listen("update", (message) => {
    value.textContent = String(message.data.value);
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```typescript
export function dispatchMessage() {
  const button = document.querySelector("#button");
  if (!button) throw new Error("unable to find button");

  button.addEventListener("click", () => {
    message.dispatch("update", {
      value: Math.floor(Math.random() * 100),
    });
  });
}
```

</details>

### React

you can use `useListener` or `useListeners` to automatically register and cleanup typed event listeners

<details><summary>open example</summary>

```typescript
import { useListeners } from "../dist/react.mjs";

const map = createBroadcastEvent("react-example", {
	first: z.object({}),
	second: z.object({ payload: z.number() }),
});

export function ExampleComponent() {
	useListeners(map, {
		first(_payload) {
```

```typescript
		},
		second(_payload) {},
	});

	return; // more jsx...
}
```

</details>

## References

- [BroadcastChannel message event](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/message_event)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)
- [Window message event](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event)
- [standardschema](https://standardschema.dev/)
