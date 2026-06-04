<div align="center">

# @stephansama/monorule

[![Source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/monorule)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/monorule)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fmonorule?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/monorule)
[![JSR](https://jsr.io/badges/@stephansama/monorule)](https://jsr.io/@stephansama/monorule)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/monorule)](https://socket.dev/npm/package/@stephansama/monorule/overview)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/monorule?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/monorule)

one rule cli to rule them all

</div>

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)

</details>

## Installation

```sh
pnpm install @stephansama/monorule
```

## Usage

```typescript
import * as z from "zod";

import { defineConfig, defineRule, parsers } from "@stephansama/monorule";

export default defineConfig({
  ignorePaths: [],
  ignoreRules: [],
  ruleDirectory: "./rules/",
  rules: [
    defineRule({
      apply(input) {
        input.touched = true;
        return input;
      },
      include: "**/data/*.json",
      name: "rule1",
      parse(input: string) {
        return z
          .object({
            touched: z.boolean().optional(),
          })
          .loose()
          .parse(parsers.json(input));
      },
      when(input) {
        if (input.touched) return;
        return [
          {
            id: "id",
            message: "json has not been touched",
          },
        ];
      },
    }),
  ],
});
```
