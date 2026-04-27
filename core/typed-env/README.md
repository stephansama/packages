# @stephansama/typed-env

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

```javascript
import * as z from "zod";

import { createEnvironment } from "@stephansama/typed-env";

export const config = createEnvironment(
  z.object({
    GENERATIVE_API_KEY: z.string(),
    OTHER_SUPER_SECRET_KEY: z.string(),
  }),
);

export async function generateExample() {
  return await config.generateExample(".env.example");
}

export async function validateEnvironment() {
  return await config.validate();
}
```
