# remark-asciinema

A [remark](https://github.com/remarkjs/remark) plugin that transforms asciinema links into either an embedded [asciinema](https://docs.asciinema.org/manual/player/) player or screenshot that links to the recording.

[![npm version](https://badge.fury.io/js/remark-asciinema.svg?icon=si%3Anpm)](https://badge.fury.io/js/remark-asciinema)
[![npm downloads](https://img.shields.io/npm/dw/remark-asciinema)](https://www.npmjs.com/package/remark-asciinema)

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
pnpm install remark-asciinema
```

## Usage

```js
import { remark } from "remark";
import asciinema from "remark-asciinema";

const file = await remark()
  .use(asciinema)
  .process("Check out: https://asciinema.org/a/abc123");

console.log(String(file));
```

**Note**: After integrating the Remark plugin, ensure you include the necessary asciinema JavaScript and CSS files to enable proper playback and styling. You can load them via [UNPKG](https://unpkg.com/):

- https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.css
- https://unpkg.com/asciinema-player@3.9.0/dist/bundle/asciinema-player.min.js
