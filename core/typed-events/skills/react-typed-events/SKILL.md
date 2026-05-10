---
name: react-typed-events
description: >
  React hooks for @stephansama/typed-events: useListener (single event) and
  useListeners (event map). Use when registering typed event listeners inside
  React components that need automatic cleanup on unmount. Import from
  @stephansama/typed-events/react. Requires react >= 18.
type: framework
library: "@stephansama/typed-events"
framework: react
library_version: "3.0.9"
requires:
  - typed-events
sources:
  - stephansama/packages:core/typed-events/src/react.ts
  - stephansama/packages:core/typed-events/README.md
---

This skill builds on `typed-events`. Read it first for foundational concepts including factory selection, cleanup patterns, and SSR behaviour.

# typed-events — React

## Setup

```ts
import * as z from "zod";
import { createBroadcastEvent } from "@stephansama/typed-events";
import { useListeners } from "@stephansama/typed-events/react";

export const appEvents = createBroadcastEvent("my-app", {
  update: z.object({ value: z.number() }),
  reset: z.object({}),
});
```

## Hooks and Components

### useListener — single event

```ts
import { useListener } from '@stephansama/typed-events/react';
import { animationEvent } from './events';

function Canvas() {
  useListener(animationEvent, ({ data }) => {
    draw(data.x, data.y);
  });

  return <canvas />;
}
```

Registers the listener on mount and removes it on unmount via `useEffect` cleanup.

### useListeners — multiple events from a map

```ts
import { useMemo } from 'react';
import { useListeners } from '@stephansama/typed-events/react';
import { appEvents } from './events';

function Dashboard() {
  const handlers = useMemo(() => ({
    update: ({ data }: { data: { value: number } }) => setValue(data.value),
    reset: () => setValue(0),
  }), []);

  useListeners(appEvents, handlers);

  return <div />;
}
```

Registers all handlers on mount and removes them all on unmount.

## Common Mistakes

### HIGH Inline listener object triggers re-registration every render

Wrong:

```tsx
function MyComponent() {
  useListeners(appEvents, {
    update: ({ data }) => setValue(data.value), // new object each render
  });
}
```

Correct:

```tsx
function MyComponent() {
  const handlers = useMemo(
    () => ({
      update: ({ data }) => setValue(data.value),
    }),
    [],
  );

  useListeners(appEvents, handlers);
}
```

`useListeners` has `[map, listeners]` in its `useEffect` dependency array. An inline object literal is a new reference every render, causing the effect to re-run: the old listener is removed and a new one is registered on every render.

Source: `core/typed-events/src/react.ts`

### HIGH Importing hooks from wrong entrypoint

Wrong:

```ts
import { useListener } from "@stephansama/typed-events"; // not exported here
```

Correct:

```ts
import { useListener, useListeners } from "@stephansama/typed-events/react";
```

React hooks are exported from the `/react` subpath only. The main entrypoint exports only the event factories.

Source: `core/typed-events/package.json` exports map

### MEDIUM Using useListener with an event map factory

Wrong:

```ts
// formEvents is a ValidatorMap (createEventMap), not a Validator
useListener(formEvents, handler); // type error — useListener expects a single Validator
```

Correct:

```ts
// For event maps, use useListeners
useListeners(formEvents, { submit: handler });
```

`useListener` accepts `Validator` (single-event factories: `createEvent`, `createBroadcastEvent`). `useListeners` accepts `ValidatorMap` (multi-event factories: `createEventMap`, `createBroadcastChannel`, `createBroadcastEvent`). Note `createBroadcastEvent` satisfies both interfaces.

Source: `core/typed-events/src/react.ts`, `core/typed-events/src/utils/types.ts`
