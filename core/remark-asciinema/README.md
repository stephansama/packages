# remark-asciinema

[![Source code](https://img.shields.io/badge/Source%20code-211F1F?style=flat&logo=github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/remark-asciinema)
[![Documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/remark-asciinema)
[![NPM Version](https://img.shields.io/npm/v/%40stephansama%2Fremark-asciinema?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/remark-asciinema)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/remark-asciinema?labelColor=211F1F)](https://www.npmjs.com/package/@stephansama/remark-asciinema)

A [remark](https://github.com/remarkjs/remark) plugin that transforms asciinema links into either an embedded [asciinema](https://docs.asciinema.org/manual/player/) player or screenshot that links to the recording.

## Features

- 🪄 Automatically converts asciinema links into:
  - `<script>` embeds for live asciinema players
  - `<img>` tags for static cast thumbnails that link to the recording

## Example

![Example](./demo.gif)

Before:

```markdown
Check out this demo: https://asciinema.org/a/12345
```

After (HTML output):

```html
Check out this demo:
<script
  id="asciicast-12345"
  src="https://asciinema.org/a/12345.js"
  async
></script>
```

## Installation

```bash
pnpm install @stephansama/remark-asciinema
```

## Usage

```javascript
import { remark } from "remark";

import asciinema from "@stephansama/remark-asciinema";

export async function pipeline() {
  const file = await remark
    .use(asciinema, { embedType: "script" })
    .process("Check out: https://asciinema.org/a/abc123");

  console.info(String(file));
}
```

## Additional notes

**Note**: After integrating the Remark plugin, ensure you include the necessary asciinema JavaScript and CSS files to enable proper playback and styling. You can load them via [UNPKG](https://unpkg.com/):

- <https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.css>
- <https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.min.js>
