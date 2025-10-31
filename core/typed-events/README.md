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
- [References](#references)

</details>

## Installation

```sh
pnpm install @stephansama/typed-events
```

## Usage

```javascript
import * as z from "zod";

import { TypedEvent } from "@stephansama/typed-events";

export const customAnimationEvent = new TypedEvent(
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
    item.style.x = event.detail.x;
    item.style.y = event.detail.y;
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

## References

- [standardschema](https://standardschema.dev/)
