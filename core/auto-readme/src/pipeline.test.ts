import remarkCodeImport from "remark-code-import";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import remarkUsage from "remark-usage";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import type { ActionData } from "./data";
import type { Config } from "./schema";

import { autoReadmeRemarkPlugin } from "./plugin";
import * as module from "./pipeline";

const mocks = vi.hoisted(() => {
	const pipeline = {
		process: vi.fn().mockResolvedValue({ toString: vi.fn().mockReturnValue("# out") }),
		use: vi.fn(),
	};
	pipeline.use.mockReturnValue(pipeline);
	return {
		createFindParameter: vi.fn().mockReturnValue(vi.fn().mockReturnValue(undefined)),
		fileExists: vi.fn().mockResolvedValue(true),
		pipeline,
		remark: vi.fn().mockReturnValue(pipeline),
		warn: vi.fn(),
	};
});

vi.mock("remark", () => ({ remark: mocks.remark }));
vi.mock("remark-code-import", () => ({ default: vi.fn() }));
vi.mock("remark-collapse", () => ({ default: vi.fn() }));
vi.mock("remark-toc", () => ({ default: vi.fn() }));
vi.mock("remark-usage", () => ({ default: vi.fn() }));
vi.mock("vfile", () => ({ VFile: vi.fn() }));
vi.mock("./plugin", () => ({ autoReadmeRemarkPlugin: vi.fn() }));
vi.mock("./data", () => ({ createFindParameter: mocks.createFindParameter }));
vi.mock("./utilities", () => ({ fileExists: mocks.fileExists }));
vi.mock("./log", () => ({ INFO: vi.fn(), WARN: mocks.warn }));

afterEach(vi.clearAllMocks);

beforeEach(() => {
	mocks.pipeline.use.mockReturnValue(mocks.pipeline);
	mocks.pipeline.process.mockResolvedValue({ toString: vi.fn().mockReturnValue("# out") });
	mocks.fileExists.mockResolvedValue(true);
	mocks.createFindParameter.mockReturnValue(vi.fn().mockReturnValue(undefined));
});

const baseConfig: Config = {
	collapseHeadings: [],
	enableToc: false,
	enableUsage: false,
	tocHeading: "Table of contents",
	usageFile: "",
	usageHeading: "Usage",
};

const noData: ActionData = [];

async function parse(config: Config = baseConfig, data: ActionData = noData) {
	return module.parse("# content", "/test/README.md", "/test", config, data);
}

it("always registers autoReadmeRemarkPlugin and remarkCodeImport", async () => {
	await parse();

	expect(mocks.pipeline.use).toHaveBeenCalledWith(autoReadmeRemarkPlugin, baseConfig, noData);
	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkCodeImport, {});
});

it("registers remarkUsage when USAGE action exists and example file exists", async () => {
	const mockFind = vi.fn().mockReturnValue("./example.js");
	mocks.createFindParameter.mockReturnValue(mockFind);
	mocks.fileExists.mockResolvedValue(true);

	const data = [{ action: "USAGE", parameters: [] }] as unknown as ActionData;
	await parse(baseConfig, data);

	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkUsage, expect.any(Object));
});

it("does not register remarkUsage when example file does not exist and warns", async () => {
	const mockFind = vi.fn().mockReturnValue("./example.js");
	mocks.createFindParameter.mockReturnValue(mockFind);
	mocks.fileExists.mockResolvedValue(false);

	const data = [{ action: "USAGE", parameters: [] }] as unknown as ActionData;
	await parse(baseConfig, data);

	expect(mocks.pipeline.use).not.toHaveBeenCalledWith(remarkUsage, expect.anything());
	expect(mocks.warn).toHaveBeenCalled();
});

it("registers remarkUsage when config.enableUsage is true and usageFile resolves", async () => {
	const mockFind = vi.fn().mockReturnValue(undefined);
	mocks.createFindParameter.mockReturnValue(mockFind);
	mocks.fileExists.mockResolvedValue(true);

	const config: Config = { ...baseConfig, enableUsage: true, usageFile: "example.js" };
	await parse(config, noData);

	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkUsage, expect.any(Object));
});

it("registers remarkToc when config.enableToc is true", async () => {
	const config: Config = { ...baseConfig, enableToc: true };
	await parse(config);

	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkToc, expect.objectContaining({ heading: "Table of contents" }));
});

it("does not register remarkToc when config.enableToc is false", async () => {
	await parse({ ...baseConfig, enableToc: false });

	expect(mocks.pipeline.use).not.toHaveBeenCalledWith(remarkToc, expect.anything());
});

it("registers remarkCollapse when config.enableToc is true", async () => {
	await parse({ ...baseConfig, enableToc: true });

	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkCollapse, expect.any(Object));
});

it("registers remarkCollapse when config.collapseHeadings has entries", async () => {
	await parse({ ...baseConfig, enableToc: false, collapseHeadings: ["## Installation"] });

	expect(mocks.pipeline.use).toHaveBeenCalledWith(remarkCollapse, expect.any(Object));
});

it("does not register remarkCollapse when neither enableToc nor collapseHeadings", async () => {
	await parse({ ...baseConfig, collapseHeadings: [], enableToc: false });

	expect(mocks.pipeline.use).not.toHaveBeenCalledWith(remarkCollapse, expect.anything());
});

it("returns the processed markdown string", async () => {
	mocks.pipeline.process.mockResolvedValue({ toString: () => "# result" });

	const result = await parse();

	expect(result).toBe("# result");
});
