import { afterEach, expect, it, vi } from "vitest";

import * as module from "./args";

const yargs = vi.hoisted(() => ({
	alias: vi.fn(() => yargs),
	default: vi.fn(() => yargs),
	epilogue: vi.fn(() => yargs),
	help: vi.fn(() => yargs),
	options: vi.fn(() => yargs),
	parse: vi.fn(),
	terminalWidth: vi.fn(() => yargs),
	wrap: vi.fn(() => yargs),
}));

const debug = vi.hoisted(() => ({ default: { enable: vi.fn() } }));

vi.mock("debug", () => ({ default: debug.default }));

vi.mock("yargs", () => ({ default: yargs.default }));

afterEach(vi.clearAllMocks);

it("loads sets verbose when added", async () => {
	yargs.parse.mockResolvedValue({ verbose: true });
	await module.parseArgs();

	expect(debug.default.enable).toHaveBeenCalled();
});

it("does not set verbosity when not added", async () => {
	yargs.parse.mockResolvedValue({ verbose: false });
	await module.parseArgs();

	expect(debug.default.enable).not.toHaveBeenCalled();
});
