# @stephansama/pnpm-hooks

## 0.1.2

### Patch Changes

- 6f8a507: `pinAllDependencies` now pins `>=`, `=`, `v`-prefixed, hyphen (`1.2.3 - 2.0.0`) and `npm:` alias ranges to their lower bound, and leaves ranges it can't pin exactly (`>`, `<`, `||`, x-ranges, partial versions, dist-tags, `workspace:` and other protocols) unchanged instead of corrupting them

## 0.1.1

### Patch Changes

- fdf1800: updated auto-readme badge implementation

## 0.1.0

### Minor Changes

- d18cb85: created pnpm hooks types and implementation package
