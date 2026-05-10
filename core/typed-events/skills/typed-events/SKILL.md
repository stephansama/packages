---
name: typed-events
description: >
  Type-safe validated wrappers for browser CustomEvent, BroadcastChannel, and
  window.postMessage APIs using any standard-schema-compatible validator (zod,
  valibot, arktype). Use when implementing createEvent, createEventMap,
  createBroadcastChannel, createBroadcastEvent, or createMessage. For React
  hooks (useListener, useListeners), see react-typed-events/SKILL.md.
type: core
library: "@stephansama/typed-events"
library_version: "3.0.9"
sources:
  - stephansama/packages:core/typed-events/src/event.ts
  - stephansama/packages:core/typed-events/src/event-map.ts
  - stephansama/packages:core/typed-events/src/broadcast.ts
  - stephansama/packages:core/typed-events/src/broadcast-event.ts
  - stephansama/packages:core/typed-events/src/message.ts
  - stephansama/packages:core/typed-events/README.md
---

# typed-events

Typed, schema-validated wrappers for native browser event APIs. Each factory returns an object with `dispatch()` and `listen()` — `listen()` returns a cleanup function.

## Choosing the right factory

| Goal                                               | Use                      |
| -------------------------------------------------- | ------------------------ |
| Fire an event on the current page                  | `createEvent`            |
| Group related events under a namespace             | `createEventMap`         |
| Sync state across browser tabs                     | `createBroadcastChannel` |
| Fire locally AND across tabs simultaneously        | `createBroadcastEvent`   |
| Send a message to an iframe or cross-origin window | `createMessage`          |

## Setup

```ts
import * as z from "zod";
import { createEvent } from "@stephansama/typed-events";

export const animationEvent = createEvent(
  "my-app:animation",
  z.object({ x: z.number(), y: z.number() }),
);
```

## Core Patterns

### Single validated CustomEvent

```ts
import * as z from "zod";
import { createEvent } from "@stephansama/typed-events";

export const clickEvent = createEvent(
  "my-app:click",
  z.object({ id: z.string() }),
);

// dispatch
clickEvent.dispatch({ id: "btn-1" });

// listen — store cleanup and call it when done
const cleanup = clickEvent.listen(({ data }) => {
  console.log(data.id);
});
// later:
cleanup();
```

### Namespaced event map (group related events)

```ts
import * as z from "zod";
import { createEventMap } from "@stephansama/typed-events";

export const formEvents = createEventMap("form", {
  submit: z.object({ values: z.record(z.string()) }),
  reset: z.object({}),
});

formEvents.dispatch("submit", { values: { email: "a@b.com" } });

const cleanup = formEvents.listen("submit", ({ data }) => {
  console.log(data.values);
});
```

Event names are scoped internally as `form:submit` and `form:reset`.

### Cross-tab sync with BroadcastChannel

```ts
import * as z from "zod";
import { createBroadcastChannel } from "@stephansama/typed-events";

export const tabChannel = createBroadcastChannel("my-app", {
  theme: z.object({ mode: z.enum(["light", "dark"]) }),
});

tabChannel.dispatch("theme", { mode: "dark" });

const cleanup = tabChannel.listen("theme", ({ data }) => {
  document.documentElement.dataset.theme = data.mode;
});
```

### Fire locally and across tabs simultaneously

```ts
import * as z from "zod";
import { createBroadcastEvent } from "@stephansama/typed-events";

export const syncEvent = createBroadcastEvent("my-app", {
  update: z.object({ value: z.number() }),
});

// dispatches both a CustomEvent (same-page) and a BroadcastChannel message (other tabs)
syncEvent.dispatch("update", { value: 42 });

const cleanup = syncEvent.listen("update", ({ data, type }) => {
  // type is 'event' (same-page) or 'message' (other tab)
  console.log(type, data.value);
});
```

### Custom EventTarget (SSR safety)

```ts
const myTarget = new EventTarget();
const ev = createEvent("my-app:tick", z.object({ ts: z.number() }), {
  target: myTarget,
});
// Or set after creation:
ev.target = myTarget;
```

Set a custom `target` before dispatching or listening in any non-browser environment. The default `target` is `document` (accessed lazily).

## Common Mistakes

### CRITICAL Async validator silently bypasses validation

Wrong:

```ts
// async zod schema
const schema = z.object({ x: z.number() }).transform(async (v) => v);
const ev = createEvent("my-app:tick", schema);
ev.dispatch({ x: 1 }); // validation runs async, callback fires before it resolves
```

Correct:

```ts
const schema = z.object({ x: z.number() });
const ev = createEvent("my-app:tick", schema);
```

When a schema's `~standard.validate` returns a Promise, typed-events fires the callback immediately and runs validation non-blocking. Invalid data reaches listeners. Use synchronous validators.

Source: `core/typed-events/src/utils/validate.ts`

### HIGH Listener not cleaned up causes memory leak

Wrong:

```ts
myEvent.listen(({ data }) => doSomething(data));
// cleanup function discarded
```

Correct:

```ts
const cleanup = myEvent.listen(({ data }) => doSomething(data));
// on teardown:
cleanup();
```

`listen()` returns a function that calls `removeEventListener`. Discarding it leaks the listener for the lifetime of the page.

Source: `core/typed-events/src/event.ts`

### HIGH Using createEvent or createMessage in SSR

Wrong:

```ts
// top-level module — executes on the server
export const ev = createEvent("my-app:tick", schema);
ev.dispatch({ ts: Date.now() }); // ReferenceError: document is not defined
```

Correct:

```ts
export const ev = createEvent("my-app:tick", schema, {
  target: new EventTarget(),
});
// or guard dispatch/listen calls inside browser-only code
```

`createEvent` defaults `target` to `document` (lazy getter). `createMessage` defaults `window` to `window`. Both throw `ReferenceError` during SSR. Set a custom `target`/`window` or only call `dispatch`/`listen` inside browser guards.

Source: `core/typed-events/src/event.ts`, `core/typed-events/src/message.ts`

### HIGH Wrong primitive for cross-tab communication

Wrong:

```ts
// createEvent only fires on the current page
const tabSync = createEvent("my-app:sync", schema);
tabSync.dispatch(payload); // other tabs never receive this
```

Correct:

```ts
import { createBroadcastChannel } from "@stephansama/typed-events";
const tabSync = createBroadcastChannel("my-app", { sync: schema });
tabSync.dispatch("sync", payload);
```

`createEvent` and `createEventMap` dispatch `CustomEvent` on an `EventTarget` — same-page only. Use `createBroadcastChannel` or `createBroadcastEvent` for cross-tab communication.

Source: `core/typed-events/src/broadcast.ts`

### HIGH Using a native DOM event name with createEvent

Wrong:

```ts
const ev = createEvent("click", schema);
// TypeScript error: Argument of type '"click"' is not assignable to parameter of type 'never'
```

Correct:

```ts
const ev = createEvent("my-app:click", schema);
```

The `Name` generic is `Restrict<string, keyof DocumentEventMap>` which resolves to `never` for any name that matches a native DOM event (`click`, `input`, `change`, etc.). Use a namespaced name.

Source: `core/typed-events/src/event.ts`, `core/typed-events/src/utils/types.ts`

### MEDIUM Tension: synchronous validation requirement

typed-events requires synchronous validators for correct dispatch/listen behaviour. Standard-schema allows async validators, but typed-events degrades silently when given one (see CRITICAL failure mode above). This same restriction applies to `@stephansama/typed-env` and `@stephansama/typed-templates`.

See also: `typed-env/SKILL.md`, `typed-templates/SKILL.md`

For React usage, see `react-typed-events/SKILL.md`.
