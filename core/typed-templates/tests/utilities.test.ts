import path from "node:path";
import * as url from "node:url";
import { expect, it } from "vitest";

import { getFileContext } from "@/utilities";

it("should create valid file context", () => {
	const context = getFileContext(import.meta.url);
	expect(context.templateDirectory).toMatch(
		path.dirname(url.fileURLToPath(import.meta.url)),
	);

	expect(context.isLinting()).toBeFalsy();
});
