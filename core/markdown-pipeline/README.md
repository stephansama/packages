# @stephansama/markdown-pipeline

Composable factory for the shared remark / rehype pipeline used by `apps/stars` and `apps/blog`.

## v0.1 scope (this package)

A thin orchestrator. Consumers supply the plugin functions they already depend on; the helpers here produce a single combined `PluggableList` (or full processor).

```ts
import {
  createPipeline,
  remarkPreset,
  rehypePreset,
} from "@stephansama/markdown-pipeline";

const processor = createPipeline({
  remarkPlugins: [remarkGfm, [remarkAsciinema, { embedType: "script" }]],
  rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: "catppuccin-mocha" }]],
});

const html = await processor.process(markdownSource);
```

For Astro:

```ts
import { remarkPreset, rehypePreset } from "@stephansama/markdown-pipeline";

export default defineConfig({
  markdown: {
    remarkPlugins: remarkPreset({ remarkPlugins: [remarkGfm /* ... */] }),
    rehypePlugins: rehypePreset({ rehypePlugins: [rehypeShiki /* ... */] }),
  },
});
```

## Roadmap (v0.2)

The `PipelineOptions` type already reserves boolean flags for the common preset bundles:

- `gfm` — once `remark-gfm` is in the workspace catalog
- `shiki` — once `@shikijs/rehype` is in the catalog
- `admonitions` — wires `remark-github-blockquote-alert` (added in STE-181)
- `slugs` — wires `rehype-slug` + `rehype-autolink-headings` once catalogued
- `externalLinks` — wires `rehype-external-links` once catalogued

These currently no-op so the API stays stable across versions. Setting them in your config does not throw.
