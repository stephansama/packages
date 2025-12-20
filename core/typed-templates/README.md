# @stephansama/typed-templates

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-templates)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-templates)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ftyped-templates?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-templates)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-templates?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-templates)

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

```javascript
import * as z from "zod";

import {
  createHandlebarSchemaMap,
  createHandlebarSchemaSingleton,
  getFileContext,
} from "@stephansama/typed-templates";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);
```

create a map of different handlebar schemas

```javascript
export const schemaMap = createHandlebarSchemaMap(
  {
    constList: {
      path: "../tests/fixtures/map/const-list.ts.hbs",
      schema: z.object({
        body: z.unknown(),
        name: z.string(),
        plural_name: z.string(),
      }),
    },
    constMap: {
      path: "../tests/fixtures/map/const-map.ts.hbs",
      schema: z.object({
        items: z.array(
          z.object({
            key: z.string(),
            value: z.unknown(),
          }),
        ),
        map_type: z.string(),
        name: z.string(),
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
    items: z.array(z.object({ key: z.string(), value: z.string() })),
    map_type: z.string(),
    name: z.string(),
  }),
  { templateDirectory },
);

if (isLinting()) await singleSchema.audit();
```

then later on in the code in another file:
