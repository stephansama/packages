# @stephansama/typed-events

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-events)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-events)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ftyped-events?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-events)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-events?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-events)

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

```javascript
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

```javascript
export function listenForAnimationEvent() {
  const item = document.getElementById("item");

  const cleanup = customAnimationEvent.listen((event) => {
    item.style.x = event.data.x;
    item.style.y = event.data.y;
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```javascript
export function dispatchEvent() {
  const x = document.getElementById("x");
  const y = document.getElementById("y");

  const button = document.getElementById("button");

  button.addEventListener("click", () => {
    customAnimationEvent.dispatch({
      x: +x.innerText,
      y: +y.innerText,
    });
  });
}
```

</details>

### createEventMap

<details><summary>open example</summary>

```javascript
import { createEventMap } from "@stephansama/typed-events";

export const eventMap = createEventMap("event-map", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```javascript
export function listenForEventMap() {
  const value = document.getElementById("value");

  const cleanup = broadcastEvent.listen("update", (message) => {
    value.textContent = message.data.value;
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```javascript
export function dispatchEventMap() {
  const button = document.getElementById("button");

  button.addEventListener("click", () => {
    broadcastEvent.dispatch("update", {
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

```javascript
import { createBroadcastChannel } from "@stephansama/typed-events";

export const channel = createBroadcastChannel("broadcaster", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```javascript
export function listenForChannelMessage() {
  const value = document.getElementById("value");

  const cleanup = channel.listen("update", (message) => {
    value.textContent = message.data.value;
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```javascript
export function dispatchChannelMessage() {
  const button = document.getElementById("button");

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

```javascript
import { createBroadcastEvent } from "@stephansama/typed-events";

export const broadcastEvent = createBroadcastEvent("broadcaster", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```javascript
export function listenForBroadcastEvent() {
  const value = document.getElementById("value");

  const cleanup = broadcastEvent.listen("update", (message) => {
    value.textContent = message.data.value;
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```javascript
export function dispatchBroadcastEvent() {
  const button = document.getElementById("button");

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

```javascript
import { createMessage } from "@stephansama/typed-events";

export const message = createMessage("event-map", {
  reset: z.object({}),
  update: z.object({ value: z.number() }),
});
```

somewhere in your codebase

```javascript
export function listenForMessage() {
  const value = document.getElementById("value");

  const cleanup = broadcastEvent.listen("update", (message) => {
    value.textContent = message.data.value;
  });

  return () => cleanup();
}
```

somewhere else in your codebase

```javascript
export function dispatchMessage() {
  const button = document.getElementById("button");

  button.addEventListener("click", () => {
    broadcastEvent.dispatch("update", {
      value: Math.floor(Math.random() * 100),
    });
  });
}
```

</details>

### React

you can use `useListener` or `useListeners` to automatically register and cleanup typed event listeners

<details><summary>open example</summary>

```javascript
import { useListeners } from "../dist/react.cjs";

const map = createBroadcastEvent("react-example", {
  first: z.object({}),
  second: z.object({ payload: z.number() }),
});

export function ExampleComponent() {
  useListeners(map, {
    first: () => console.info("first event happened"),
    second: ({ data }) => console.info(data.payload),
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
