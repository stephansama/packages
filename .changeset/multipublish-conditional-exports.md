---
"@stephansama/multipublish": patch
---

fix jsr transformer crash on any package.json whose conditional `exports` use conditions other than `import` / `require` (e.g. `svelte`, `types`-only entries, `default`-only entries, or nested conditions). The schema now accepts arbitrary recursive conditional exports and the transformer picks the first resolvable runtime path - preferring `import` / `module` / `default` / `node` / `browser` / `require` (esm-first, since jsr is esm-only), falling back to any non-`types` string - and drops entries with no runtime path so `types`-only sub-exports no longer break `experimentalGenerateJSR`. Top-level condition sugar (an `exports` object with no `.`-prefixed keys) is now treated as the `.` entry
