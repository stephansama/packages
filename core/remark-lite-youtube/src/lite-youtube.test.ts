import { remark } from "remark";
import { describe, expect, it } from "vitest";

import plugin from "./index";
import { extractYoutubeId } from "./utilities";

describe("extractYoutubeId", () => {
	it("parses watch?v= URLs", () => {
		expect(
			extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
		).toBe("dQw4w9WgXcQ");
	});

	it("parses youtu.be short URLs", () => {
		expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe(
			"dQw4w9WgXcQ",
		);
	});

	it("parses /embed/ URLs", () => {
		expect(
			extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"),
		).toBe("dQw4w9WgXcQ");
	});

	it("returns undefined for non-YouTube URLs", () => {
		expect(extractYoutubeId("https://example.com/watch?v=foo")).toBe(
			undefined,
		);
	});

	it("returns undefined for malformed strings", () => {
		expect(extractYoutubeId("not a url")).toBe(undefined);
	});
});

describe("remark-lite-youtube", () => {
	it("replaces YouTube links with <lite-youtube>", async () => {
		const input =
			"# Heading\n\n[My Video Title](https://www.youtube.com/watch?v=dQw4w9WgXcQ)\n";
		const result = await remark().use(plugin).process(input);
		const out = String(result);
		expect(out).toContain(
			'<lite-youtube videoid="dQw4w9WgXcQ" playlabel="My Video Title"></lite-youtube>',
		);
	});

	it("uses defaultPlayLabel when the link has no text", async () => {
		const input = "[ ](https://youtu.be/dQw4w9WgXcQ)\n";
		const result = await remark()
			.use(plugin, { defaultPlayLabel: "Watch" })
			.process(input);
		const out = String(result);
		expect(out).toContain('playlabel="Watch"');
	});

	it("leaves non-YouTube links untouched", async () => {
		const input = "[Example](https://example.com/page)\n";
		const result = await remark().use(plugin).process(input);
		const out = String(result);
		expect(out).toContain("[Example](https://example.com/page)");
		expect(out).not.toContain("<lite-youtube");
	});
});
