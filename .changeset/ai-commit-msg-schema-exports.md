---
"@stephansama/ai-commit-msg": patch
"@stephansama/multipublish": patch
"@stephansama/monorule": patch
---

point the `./schema.json` export and the top-level `types` field at `dist`. they referenced a `config/` folder that isn't published, so importing `@stephansama/ai-commit-msg/schema.json` failed. put the `types` condition first in `monorule`'s exports so typescript resolves it. `publint` now runs on every build, so a missing or misordered export fails the build. `loadRules` now declares its return type as `RuleMapSchema[string][]`, and `RuleMapSchema` is exported, so the published types stay the same from build to build
