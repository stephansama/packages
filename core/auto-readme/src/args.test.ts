import { expect, it, vi } from "vitest";

import * as module from "./args";
import * as logger from "./log";

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

vi.mock("yargs", () => ({ default: yargs.default }));

it("loads sets verbose when added", async () => {
	const setVerboseSpy = vi.spyOn(logger, "setVerbosity");
	yargs.parse.mockResolvedValue({ verbose: true });
	await module.parseArgs();

	expect(setVerboseSpy).toHaveBeenCalled();
});

it("does not set verbosity when not added", async () => {
	const setVerboseSpy = vi.spyOn(logger, "setVerbosity");
	yargs.parse.mockResolvedValue({ verbose: false });
	await module.parseArgs();

	expect(setVerboseSpy).not.toHaveBeenCalled();
});
