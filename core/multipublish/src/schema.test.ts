import { describe, expect, it } from "vitest";

import { configSchema, platformsSchema } from "./schema";

describe("schema", () => {
	describe("platformsSchema", () => {
		it("should accept simple platform strings", () => {
			const valid = ["npm", "jsr"];
			const result = platformsSchema.parse(valid);
			expect(result).toEqual(valid);
		});

		it("should accept platform tuples with options", () => {
			const input = [
				["npm", { registry: "https://custom.registry" }],
				["jsr", { allowSlowTypes: false }],
			];
			const expected = [
				[
					"npm",
					{
						registry: "https://custom.registry",
						strategy: ".npmrc",
						tokenEnvironmentKey: "NODE_AUTH_TOKEN",
					},
				],
				[
					"jsr",
					{
						allowSlowTypes: false,
						experimentalGenerateJSR: false,
						experimentalUpdateCatalogs: false,
						tokenEnvironmentKey: "JSR_AUTH_TOKEN",
					},
				],
			];
			const result = platformsSchema.parse(input);
			expect(result).toEqual(expected);
		});

		it("should reject invalid platforms", () => {
			expect(() => {
				platformsSchema.parse(["invalid"]);
			}).toThrow();
		});
	});

	describe("configSchema", () => {
		it("should accept valid config", () => {
			const config = {
				platforms: ["npm"],
				tmpDirectory: "custom-tmp",
				useChangesets: false,
			};
			const result = configSchema.parse(config);
			expect(result).toEqual(config);
		});

		it("should use default values", () => {
			const config = {
				platforms: ["jsr"],
			};
			const result = configSchema.parse(config);
			expect(result.tmpDirectory).toBe(".release");
			expect(result.useChangesets).toBe(true);
		});

		it("should reject missing required fields", () => {
			expect(() => {
				configSchema.parse({}); // platforms is required
			}).toThrow();
		});
	});
});
