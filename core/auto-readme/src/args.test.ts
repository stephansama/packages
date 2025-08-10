import { expect, it, vi } from "vitest";

import * as module from "./args";
import * as logger from "./log";

const mocks = vi.hoisted(() => ({ parse: vi.fn() }));

vi.mock("yargs", () => ({
	default: vi.fn().mockReturnValue({
		options: vi.fn().mockReturnValue({
			help: vi.fn().mockReturnValue({
				alias: vi.fn().mockReturnValue({
					epilogue: vi.fn().mockReturnValue({
						terminalWidth: vi.fn(),
						wrap: vi.fn().mockReturnValue({ parse: mocks.parse }),
					}),
				}),
			}),
		}),
	}),
}));

it("loads sets verbose when added", async () => {
	const setVerboseSpy = vi.spyOn(logger, "setVerbosity");
	mocks.parse.mockResolvedValue({ verbose: true });
	await module.parseArgs();

	expect(setVerboseSpy).toHaveBeenCalled();
});

it("does not set verbosity when not added", async () => {
	const setVerboseSpy = vi.spyOn(logger, "setVerbosity");
	mocks.parse.mockResolvedValue({ verbose: false });
	await module.parseArgs();

	expect(setVerboseSpy).not.toHaveBeenCalled();
});
