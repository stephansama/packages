---
name: typed-templates
description: >
  Validate Handlebars template variables against standard-schema schemas using
  createHandlebarSchemaMap (per-template schemas) or createHandlebarSchemaSingleton
  (one schema for multiple templates). Use getFileContext(import.meta.url) for
  correct path resolution. audit() checks template slots match schema shape.
  compile(key, data) validates data then renders. Supports zod, valibot, arktype only.
type: core
library: "@stephansama/typed-templates"
library_version: "1.1.6"
sources:
  - stephansama/packages:core/typed-templates/src/map.ts
  - stephansama/packages:core/typed-templates/src/singleton.ts
  - stephansama/packages:core/typed-templates/src/utilities.ts
  - stephansama/packages:core/typed-templates/src/normalize.ts
  - stephansama/packages:core/typed-templates/README.md
---

# typed-templates

Schema-validated Handlebars template compilation. `audit()` verifies template slot names match the schema at authoring time. `compile(key, data)` validates data at runtime then renders.

## Choosing the right factory

| Scenario                                     | Use                              |
| -------------------------------------------- | -------------------------------- |
| Each template has a different data shape     | `createHandlebarSchemaMap`       |
| Multiple templates share the same data shape | `createHandlebarSchemaSingleton` |

## Setup

```ts
import * as z from "zod";
import {
  createHandlebarSchemaMap,
  getFileContext,
} from "@stephansama/typed-templates";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

export const templates = createHandlebarSchemaMap(
  {
    greeting: {
      path: "greeting.hbs",
      schema: z.object({ name: z.string() }),
    },
  },
  { templateDirectory },
);

if (isLinting()) await templates.audit();
```

`getFileContext(import.meta.url)` resolves `templateDirectory` to the directory of the current file — not the working directory. `isLinting()` returns `true` only when this file is run directly (e.g. `node ./templates.ts`), preventing `audit()` from running on every import.

## Core Patterns

### Compile a template

```ts
const output = await templates.compile("greeting", { name: "Alice" });
// data is validated against the schema before compilation
```

### Singleton: one schema, multiple templates

```ts
import * as z from "zod";
import {
  createHandlebarSchemaSingleton,
  getFileContext,
} from "@stephansama/typed-templates";

const { isLinting, templateDirectory } = getFileContext(import.meta.url);

const itemSchema = z.object({
  items: z.array(z.object({ key: z.string(), value: z.string() })),
});

export const itemTemplates = createHandlebarSchemaSingleton(
  ["list.hbs", "table.hbs"],
  itemSchema,
  { templateDirectory },
);

if (isLinting()) await itemTemplates.audit();

const output = await itemTemplates.compile("list.hbs", {
  items: [{ key: "a", value: "1" }],
});
```

### Run audit as a lint script

```json
{
  "scripts": {
    "lint:templates": "tsx ./src/templates.ts"
  }
}
```

`isLinting()` returns true when `process.argv[1]` matches the file's URL path — i.e. when the file is the entry point. Running it directly triggers `audit()` and throws on any mismatch between template slots and schema keys.

## Common Mistakes

### HIGH Not using getFileContext(import.meta.url)

Wrong:

```ts
const templates = createHandlebarSchemaMap(map, {
  templateDirectory: "./templates", // resolved from process.cwd()
});
```

Correct:

```ts
const { templateDirectory } = getFileContext(import.meta.url);
const templates = createHandlebarSchemaMap(map, { templateDirectory });
```

Template paths are resolved with `path.resolve(templateDirectory, item.path)`. Without `getFileContext`, `templateDirectory` is a cwd-relative string that breaks when the file is imported from a different working directory (e.g. in CI or monorepo scripts).

Source: `core/typed-templates/src/utilities.ts:getFileContext`

### HIGH Calling audit() without isLinting() guard

Wrong:

```ts
export const templates = createHandlebarSchemaMap(map, { templateDirectory });
await templates.audit(); // runs on every import — reads filesystem and throws
```

Correct:

```ts
export const templates = createHandlebarSchemaMap(map, { templateDirectory });
const { isLinting } = getFileContext(import.meta.url);
if (isLinting()) await templates.audit();
```

`audit()` reads template files and throws on schema mismatches. Without the guard it runs at application startup on every import, not just during linting.

Source: `core/typed-templates/src/utilities.ts:getFileContext`

### HIGH Schema library other than zod, valibot, or arktype

Wrong:

```ts
import { Type } from "@sinclair/typebox";
const templates = createHandlebarSchemaMap(
  { tmpl: { path: "tmpl.hbs", schema: Type.Object({ name: Type.String() }) } },
  { templateDirectory },
);
await templates.audit(); // throws: "invalid schema provider"
```

Correct:

```ts
import * as z from "zod";
const templates = createHandlebarSchemaMap(
  { tmpl: { path: "tmpl.hbs", schema: z.object({ name: z.string() }) } },
  { templateDirectory },
);
```

`audit()` calls `normalizeStandardSchema` which has a hard-coded vendor switch. Only `"zod"`, `"valibot"`, and `"arktype"` are handled.

Source: `core/typed-templates/src/normalize.ts:normalizeStandardSchema`

### MEDIUM Using singleton when templates have different shapes

Wrong:

```ts
// header.hbs uses { title, subtitle } — footer.hbs uses { links[] }
const single = createHandlebarSchemaSingleton(
  ["header.hbs", "footer.hbs"],
  z.object({ title: z.string() }), // one schema for both
  { templateDirectory },
);
// audit() passes for header, silently allows wrong compile() calls for footer
```

Correct:

```ts
const map = createHandlebarSchemaMap(
  {
    header: {
      path: "header.hbs",
      schema: z.object({ title: z.string(), subtitle: z.string() }),
    },
    footer: {
      path: "footer.hbs",
      schema: z.object({ links: z.array(z.string()) }),
    },
  },
  { templateDirectory },
);
```

`createHandlebarSchemaSingleton` validates all files against a single schema. Use it only when all files share the exact same slot names. Use `createHandlebarSchemaMap` when templates differ.

Source: `core/typed-templates/src/map.ts`, `core/typed-templates/src/singleton.ts`

See also: `typed-env/SKILL.md` — same vendor restriction applies.
