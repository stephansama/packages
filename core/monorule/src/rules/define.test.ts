import { describe, expect, it } from "vitest";

import { defineRule } from "./define";

describe("defineRule", () => {
	it("should return an identity function when called without a rule", () => {
		const identity = (
			defineRule as unknown as () => (input: unknown) => unknown
		)();
		expect(identity("hello")).toBe("hello");
	});

	it("should bind `this` for when so it keeps access to the rule", () => {
		const rule = defineRule({
			errors: { missing: "missing value" },
			include: "**/*",
			name: "when-rule",
			parse: "json",
			when() {
				return this.errors as never;
			},
		});

		// eslint-disable-next-line @typescript-eslint/unbound-method -- intentionally detaching to prove `this` binding
		const detached = rule.when;
		expect(detached({})).toBe(rule.errors);
	});

	it("should bind `this` for apply when present", () => {
		const rule = defineRule({
			apply() {
				return this.errors as never;
			},
			errors: { missing: "missing value" },
			include: "**/*",
			name: "apply-rule",
			parse: "json",
			when() {
				return;
			},
		});

		const detached = rule.apply;
		expect(detached?.({})).toBe(rule.errors);
	});

	it("should leave apply undefined when not provided", () => {
		const rule = defineRule({
			errors: {},
			include: "**/*",
			name: "no-apply-rule",
			parse: "json",
			when() {
				return;
			},
		});

		expect(rule.apply).toBeUndefined();
	});
});
