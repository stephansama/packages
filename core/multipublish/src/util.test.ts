import { describe, expect, it } from "vitest";

import { npmrcTemplate } from "./util";

describe("npmrcTemplate", () => {
	it("should generate correct .npmrc content", () => {
		const opts = {
			authToken: "my-secret-token",
			registry: "https://registry.npmjs.org/",
			registryDomain: "registry.npmjs.org",
			scope: "@my-scope",
		};

		const expected = `
@my-scope:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=my-secret-token
`.trim();

		const result = npmrcTemplate(opts);
		expect(result.trim()).toBe(expected);
	});
});
