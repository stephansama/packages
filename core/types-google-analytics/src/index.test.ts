import { describe, expectTypeOf, it } from "vitest";

import type {
	DataLayerEvent,
	GA4EventName,
	GA4EventParamsMap as GA4EventParametersMap,
	GA4PurchaseEventParams as GA4PurchaseEventParameters,
	Gtag,
} from "./index";

// These are type-level assertions — the runtime body of each `it` is empty
// because the value of the test is in `expectTypeOf` at compile time.

describe("@stephansama/google-analytics-types", () => {
	it("gtag accepts typed purchase params", () => {
		const gtag = (() => {
			/* noop */
		}) as Gtag;
		gtag("event", "purchase", {
			currency: "USD",
			items: [{ item_id: "sku-1", price: 9.99, quantity: 1 }],
			transaction_id: "tx-1",
			value: 9.99,
		});
		expectTypeOf<GA4PurchaseEventParameters>().toMatchTypeOf<{
			currency: string;
			transaction_id: string;
			value: number;
		}>();
	});

	it("gtag accepts string custom event names with arbitrary params", () => {
		const gtag = (() => {
			/* noop */
		}) as Gtag;
		gtag("event", "my_custom_event", { foo: "bar" });
		expectTypeOf(gtag).toBeFunction();
	});

	it("dataLayer.push payload is a discriminated union on event", () => {
		expectTypeOf<DataLayerEvent>().toMatchTypeOf<
			Record<string, unknown> & { event: string }
		>();
	});

	it("GA4EventName is keyof GA4EventParamsMap", () => {
		expectTypeOf<GA4EventName>().toEqualTypeOf<
			keyof GA4EventParametersMap
		>();
	});
});
