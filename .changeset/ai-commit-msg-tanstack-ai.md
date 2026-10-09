---
"@stephansama/ai-commit-msg": minor
---

migrate from the vercel ai sdk to tanstack ai. the google provider now also accepts `GOOGLE_API_KEY` or `GEMINI_API_KEY`, and ollama respects `OLLAMA_HOST`. the `model` config option is now typed as the known adapter models or any other string, so editors can autocomplete model names
