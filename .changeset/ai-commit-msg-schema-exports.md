---
"@stephansama/ai-commit-msg": patch
"@stephansama/multipublish": patch
---

point the `./schema.json` export and the top-level `types` field at `dist`. they referenced a `config/` folder that isn't published, so importing `@stephansama/ai-commit-msg/schema.json` failed. `publint` now runs after every build so a missing export target fails the build
