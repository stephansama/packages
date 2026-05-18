# @stephansama/google-analytics-types

Types-only package covering both Google Tag Manager `dataLayer` push payloads and GA4 `gtag('event', ...)` call signatures. One package, two surfaces, shared event taxonomy.

## What you get

- **`Gtag`** — function signature with typed overloads. `gtag('event', 'purchase', { ... })` requires the right shape for that event; arbitrary string names still work with `Record<string, unknown>` params for custom events.
- **`DataLayerEvent`** — discriminated union on `event` covering all recommended GA4 events. Pushed into `window.dataLayer` you get autocomplete based on the event name.
- **`GA4EventParamsMap`** + per-event interfaces (`GA4PurchaseEventParams`, `GA4ViewItemEventParams`, …) — extend these with TS module augmentation if you ship many app-specific events.
- **`GA4Item`** — the shared ecommerce item shape used across `purchase` / `refund` / cart / item-list events.

## Window augmentation

The package augments `globalThis.Window` with typed `dataLayer` and `gtag` properties — no extra imports needed at call sites.

```ts
window.gtag("event", "purchase", {
  currency: "USD",
  transaction_id: "tx-1",
  value: 9.99,
  items: [{ item_id: "sku-1", price: 9.99, quantity: 1 }],
});

window.dataLayer.push({
  event: "view_item",
  currency: "USD",
  value: 14.99,
  items: [{ item_id: "sku-2", price: 14.99 }],
});
```

## Covered recommended events

`add_payment_info`, `add_shipping_info`, `add_to_cart`, `begin_checkout`, `generate_lead`, `login`, `purchase`, `refund`, `remove_from_cart`, `search`, `select_item`, `select_promotion`, `share`, `sign_up`, `view_cart`, `view_item`, `view_item_list`, `view_promotion`.

Source: [GA4 recommended events reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).
