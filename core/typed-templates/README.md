<div align="center">

# [`@stephansama`](https://github.com/stephansama) / typed-templates

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-templates)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-templates)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Ftyped-templates?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-templates)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/typed-templates)](https://socket.dev/npm/package/@stephansama/typed-templates/overview)
[![jsr](https://jsr.io/badges/@stephansama/typed-templates)](https://jsr.io/@stephansama/typed-templates)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-templates?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-templates)

[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-0.0.41-00a6f4.svg?logo=tanstack&logoColor=ffffff&labelColor=00a6f4)](https://npmx.dev/package/@tanstack/intent)
[![handlebars](https://img.shields.io/badge/handlebars-4.7.9-d46926.svg?logo=handlebarsdotjs&logoColor=ffffff&labelColor=d46926)](https://npmx.dev/package/handlebars)
[![tsdown](https://img.shields.io/badge/tsdown-0.21.10-3178C6.svg?logo=rolldown&logoColor=ffffff&labelColor=3178C6)](https://npmx.dev/package/tsdown)
[![zod](https://img.shields.io/badge/zod-4.2.1-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)

<!-- BADGE end -->

</div>

Use standard schema to validate and use handlebar template directories

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/typed-templates
```

## Usage

create a map of different handlebar schemas

```javascript
import * as z from "zod";

import {
  createHandlebarSchemaMap,
  createHandlebarSchemaSingleton,
  getFileContext,
} from "@stephansama/typed-templates";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

export const schemaMap = createHandlebarSchemaMap(
  {
    constList: {
      path: "../tests/fixtures/map/const-list.ts.hbs",
      schema: z.object({
        body: z.unknown(),
        name: z.string().trim(),
        plural_name: z.string().trim(),
      }),
    },
    constMap: {
      path: "../tests/fixtures/map/const-map.ts.hbs",
      schema: z.object({
        items: z.array(
          z.object({
            key: z.string().trim(),
            value: z.unknown(),
          }),
        ),
        map_type: z.string().trim(),
        name: z.string().trim(),
      }),
    },
  },
  { templateDirectory },
);

if (isLinting()) await schemaMap.audit();
```

or create a singleton schema used to validate multiple templates

```javascript
export const singleSchema = createHandlebarSchemaSingleton(
  [
    "../tests/fixtures/singleton/valid.hbs",
    "../tests/fixtures/singleton/valid2.hbs",
  ],
  z.object({
    items: z.array(
      z.object({ key: z.string().trim(), value: z.string().trim() }),
    ),
    map_type: z.string().trim(),
    name: z.string().trim(),
  }),
  { templateDirectory },
);

if (isLinting()) await singleSchema.audit();
```

then later on in the code in another file:

```javascript
export async function useTemplate() {
  return await schemaMap.compile("constList", {
    body: "body",
    name: "Name",
    plural_name: "Plural",
  });
}
```
