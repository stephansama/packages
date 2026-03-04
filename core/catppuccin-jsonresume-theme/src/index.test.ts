import { describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";

import { render } from "./index";

vi.mock("node:fs", async (importOriginal) => {
	const actual = await importOriginal<typeof import("node:fs")>();
	return {
		...actual,
		readFileSync: vi.fn((path, options) => {
			if (typeof path === "string" && path.includes("dist-css/site.css")) {
				return "/* mock css */";
			}
			return actual.readFileSync(path, options);
		}),
	};
});

describe("render", () => {
	it("should render a resume", () => {
		const resume = {
			basics: {
				email: "john@example.com",
				image: "https://example.com/image.png",
				label: "Software Engineer",
				location: {
					city: "New York",
					countryCode: "US",
					region: "NY",
				},
				name: "John Doe",
				phone: "123-456-7890",
				profiles: [
					{
						network: "GitHub",
						url: "https://github.com/johndoe",
						username: "johndoe",
					},
				],
				summary: "A summary of John Doe",
				url: "https://example.com",
			},
			skills: [
				{
					keywords: ["HTML", "CSS", "JavaScript"],
					name: "Web Development",
				},
			],
			work: [
				{
					endDate: "2021-01-01",
					highlights: ["Did things"],
					name: "Example Corp",
					position: "Software Engineer",
					startDate: "2020-01-01",
					summary: "Worked on stuff",
					url: "https://example.com",
				},
			],
		};

		const output = render(resume);

		expect(output).toContain("John Doe");
		expect(output).toContain("Software Engineer");
		expect(output).toContain("Example Corp");
		expect(output).toContain("Web Development");
	});

	it("should handle empty fields", () => {
		const resume = {
			basics: {
				name: "John Doe",
			},
		};

		const output = render(resume);

		expect(output).toContain("John Doe");
	});

	it("should correctly format dates with year helper", () => {
		const resume = {
			work: [
				{
					name: "Date Corp",
					startDate: "2020-05-15",
				},
			],
		};
		const output = render(resume);
		expect(output).toContain("2020");
	});
});
