# @stephansama/typed-nocodb-api

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-nocodb-api)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-nocodb-api)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ftyped-nocodb-api?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-nocodb-api)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-nocodb-api?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/typed-nocodb-api)

standard schema compatible nocodb api

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/typed-nocodb-api
```

## Usage

```javascript
/* eslint perfectionist/sort-imports: ["off"] */
```

```javascript
import { createApi } from "@stephansama/typed-nocodb-api";

const api = createApi({
  baseId: process.env.NOCODB_BASE,
  origin: "https://nocodb.com",
  schema: z.object({
    column1: z.string(),
    column2: z.enum(["optionOne", "optionTwo", "optionThree"]),
    column3: z.number(),
    column4: z.boolean(),
  }),
  tableId: process.env.NOCODB_TABLE,
  token: process.env.NOCODB_TOKEN,
});

export function callApi() {
  api.fetch({
    action: "LIST",
  });
}
```
