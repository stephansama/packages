---
"@stephansama/types-google-analytics": minor
---

Initial release. Types-only package covering both Google Tag Manager `dataLayer.push(...)` payloads and GA4 `gtag('event', ...)` signatures, sharing one event taxonomy. Ships `Gtag`, `DataLayerEvent`, `GA4EventParamsMap`, `GA4Item`, and per-event interfaces for the 18 recommended GA4 events. Augments `Window` with typed `dataLayer` + `gtag` properties.
