import { beforeEach, expect, it, vi } from "vitest";

import * as module from "./index";

const mocks = vi.hoisted(() => ({
	parser: vi.fn(),
	readFile: vi.fn(),
	resolve: vi.fn(),
}));

vi.mock("@kba/makefile-parser", () => ({ default: mocks.parser }));
vi.mock("node:fs/promises", () => ({ readFile: mocks.readFile }));
vi.mock("node:path", () => ({ resolve: mocks.resolve }));

beforeEach(() => {
	process.argv = ["node", "cli.mjs", "Makefile"];
});

it("runs", () => {
	mocks.parser.mockReturnValue({ ast: [{ target: "test" }] });
	expect(module.main).not.toThrowError();
});
