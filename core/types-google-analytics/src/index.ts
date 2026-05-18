/* eslint-disable unicorn/prevent-abbreviations -- "Params" matches GA4's documented type names; renaming to "Parameters" would diverge from upstream docs */
/**
 * @stephansama/google-analytics-types
 *
 * Types-only package covering the two surfaces we instrument together:
 *
 * 1. `window.dataLayer.push(...)` payloads used with Google Tag Manager.
 * 2. `gtag('event', name, params)` calls used with GA4.
 *
 * Recommended-event params are hand-authored from
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 * Custom events are supported via the generic `CustomEvent` slot on either
 * surface — extend the unions in your own module augmentation if you ship many
 * app-specific events.
 */

// ────────────────────────────────────────────────────────────────────────────
// Shared item shape used across ecommerce events
// ────────────────────────────────────────────────────────────────────────────

export type DataLayerEvent =
	| (Record<string, unknown> & { event: string })
	| {
			[K in GA4EventName]: GA4EventParamsMap[K] & { event: K };
	  }[GA4EventName];

// ────────────────────────────────────────────────────────────────────────────
// Recommended GA4 event param shapes
// ────────────────────────────────────────────────────────────────────────────

export interface GA4AddPaymentInfoEventParams extends GA4BeginCheckoutEventParams {
	payment_type?: string;
}
export interface GA4AddShippingInfoEventParams extends GA4BeginCheckoutEventParams {
	shipping_tier?: string;
}
export interface GA4AddToCartEventParams {
	currency: string;
	items: GA4Item[];
	value: number;
}
export interface GA4BeginCheckoutEventParams extends GA4AddToCartEventParams {
	coupon?: string;
}
export type GA4EventName = keyof GA4EventParamsMap;
export interface GA4EventParamsMap {
	add_payment_info: GA4AddPaymentInfoEventParams;
	add_shipping_info: GA4AddShippingInfoEventParams;
	add_to_cart: GA4AddToCartEventParams;
	begin_checkout: GA4BeginCheckoutEventParams;
	generate_lead: GA4GenerateLeadEventParams;
	login: GA4LoginEventParams;
	purchase: GA4PurchaseEventParams;
	refund: GA4RefundEventParams;
	remove_from_cart: GA4RemoveFromCartEventParams;
	search: GA4SearchEventParams;
	select_item: GA4SelectItemEventParams;
	select_promotion: GA4SelectPromotionEventParams;
	share: GA4ShareEventParams;
	sign_up: GA4SignUpEventParams;
	view_cart: GA4ViewCartEventParams;
	view_item: GA4ViewItemEventParams;
	view_item_list: GA4ViewItemListEventParams;
	view_promotion: GA4ViewPromotionEventParams;
}
export interface GA4GenerateLeadEventParams {
	currency?: string;
	value?: number;
}
export interface GA4Item {
	affiliation?: string;
	coupon?: string;
	currency?: string;
	discount?: number;
	index?: number;
	item_brand?: string;
	item_category?: string;
	item_category2?: string;
	item_category3?: string;
	item_category4?: string;
	item_category5?: string;
	item_id?: string;
	item_list_id?: string;
	item_list_name?: string;
	item_name?: string;
	item_variant?: string;
	location_id?: string;
	price?: number;
	quantity?: number;
}
export interface GA4LoginEventParams {
	method?: string;
}
export interface GA4PurchaseEventParams {
	coupon?: string;
	currency: string;
	items?: GA4Item[];
	shipping?: number;
	tax?: number;
	transaction_id: string;
	value: number;
}
export interface GA4RefundEventParams {
	coupon?: string;
	currency?: string;
	items?: GA4Item[];
	shipping?: number;
	tax?: number;
	transaction_id?: string;
	value?: number;
}
export interface GA4RemoveFromCartEventParams extends GA4AddToCartEventParams {}
export interface GA4SearchEventParams {
	search_term: string;
}
export interface GA4SelectItemEventParams extends GA4ViewItemListEventParams {}
export interface GA4SelectPromotionEventParams {
	creative_name?: string;
	creative_slot?: string;
	items?: GA4Item[];
	location_id?: string;
	promotion_id?: string;
	promotion_name?: string;
}
export interface GA4ShareEventParams {
	content_type?: string;
	item_id?: string;
	method?: string;
}
export interface GA4SignUpEventParams extends GA4LoginEventParams {}
export interface GA4ViewCartEventParams extends GA4AddToCartEventParams {}

// ────────────────────────────────────────────────────────────────────────────
// Event-name → params map (the canonical place to extend for custom events)
// ────────────────────────────────────────────────────────────────────────────

export interface GA4ViewItemEventParams {
	currency: string;
	items: GA4Item[];
	value: number;
}

export interface GA4ViewItemListEventParams {
	item_list_id?: string;
	item_list_name?: string;
	items: GA4Item[];
}

// ────────────────────────────────────────────────────────────────────────────
// gtag() function signature — typed overloads on event name
// ────────────────────────────────────────────────────────────────────────────

export interface GA4ViewPromotionEventParams extends GA4SelectPromotionEventParams {}

// ────────────────────────────────────────────────────────────────────────────
// GTM dataLayer push — discriminated union on `event`
// ────────────────────────────────────────────────────────────────────────────

export interface Gtag {
	/** GA4 event with typed recommended params */
	<Name extends GA4EventName>(
		command: "event",
		name: Name,
		parameters: GA4EventParamsMap[Name],
	): void;
	/** GA4 custom event with arbitrary params */
	(
		command: "event",
		name: string,
		parameters?: Record<string, unknown>,
	): void;
	/** Initialise a property */
	(
		command: "config",
		targetId: string,
		parameters?: Record<string, unknown>,
	): void;
	/** Set global params */
	(command: "set", parameters: Record<string, unknown>): void;
	/** Consent mode */
	(
		command: "consent",
		action: "default" | "update",
		parameters: Record<string, unknown>,
	): void;
	/** Get a tracker field via callback */
	(
		command: "get",
		targetId: string,
		field: string,
		callback?: (value: unknown) => void,
	): void;
}

// ────────────────────────────────────────────────────────────────────────────
// Window augmentation
// ────────────────────────────────────────────────────────────────────────────

declare global {
	interface Window {
		dataLayer: DataLayerEvent[];
		gtag: Gtag;
	}
}

export {};
