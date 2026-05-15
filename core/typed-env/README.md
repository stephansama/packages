<div align="center">

# [`@stephansama`](https://github.com/stephansama) / typed-env

<!-- BADGE start -->

[![@dotenvx/dotenvx](https://img.shields.io/badge/@dotenvx/dotenvx-catalog:-ECD53F.svg?logo=dotenv&logoColor=ffffff&labelColor=ECD53F)](https://npmx.dev/package/@dotenvx/dotenvx)
[![@tanstack/intent](https://img.shields.io/badge/@tanstack/intent-catalog:tanstack-000000.svg?logo=tanstack&logoColor=ffffff&labelColor=000000)](https://npmx.dev/package/@tanstack/intent)
[![zod](https://img.shields.io/badge/zod-catalog:schema-408AFF.svg?logo=zod&logoColor=ffffff&labelColor=408AFF)](https://npmx.dev/package/zod)

<!-- BADGE end -->

</div>

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/typed-env)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/typed-env)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Ftyped-env?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-env)
[![JSR](https://jsr.io/badges/@stephansama/typed-env)](https://jsr.io/@stephansama/typed-env)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/typed-env)](https://socket.dev/npm/package/@stephansama/typed-env/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/typed-env?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/typed-env)

standard schema compatible environment validator

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/typed-env
```

## Usage

is already a namespace import

```javascript
import * as z from "zod";

import { createEnvironment } from "../dist/index.mjs";

export const config = createEnvironment(
  z.object({
    GENERATIVE_API_KEY: z.string().trim(),
    OTHER_SUPER_SECRET_KEY: z.string().trim(),
  }),
);

export async function generateExample() {
  return await config.generateExample(".env.example");
}

export async function validateEnvironment() {
  return await config.validate();
}
```
