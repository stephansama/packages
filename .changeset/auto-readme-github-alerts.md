---
"@stephansama/auto-readme": patch
---

keep github alert markers (`> [!NOTE]`, `> [!WARNING]`, …) unescaped. remark escaped the leading `[`, so github rendered alerts as plain blockquotes. already escaped markers are repaired on the next run
