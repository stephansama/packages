import { afterEach, expect, it, vi } from "vitest";

import * as module from "./config";
import * as logger from "./log";
import { configSchema } from "./schema";

const searchMock = vi.hoisted(() => ({ mock: vi.fn() }));

const mocks = vi.hoisted(() => ({
	cosmiconfig: vi.fn().mockReturnValue({ search: searchMock.mock }),
	deepmerge: vi.fn(),
	getDefaultSearchPlaces: vi.fn().mockReturnValue([]),
}));

vi.mock("cosmiconfig", () => ({
	cosmiconfig: mocks.cosmiconfig,
	getDefaultSearchPlaces: mocks.getDefaultSearchPlaces,
}));

vi.mock("deepmerge", () => ({ default: mocks.deepmerge }));

const toml = String.raw;
const mockToml = toml`
key = "value"

[nested]
key = "value"
`;

afterEach(vi.clearAllMocks);

it("loadsToml properly", () => {
	const obj = module.loadToml("", mockToml);
	expect(obj).toBeTruthy();
});

it("throws an error when invalid toml is provided to loadsToml", () => {
	const trim = mockToml.trim();
	const size = trim.length;
	const trimmed = trim.slice(0, size - 1); // remove the last character to invalidate the toml

	expect(() => module.loadToml("", trimmed)).toThrowError();
});

it("loads the default config", async () => {
	const infoSpy = vi.spyOn(logger, "INFO");
	const warnSpy = vi.spyOn(logger, "WARN");

	searchMock.mock.mockResolvedValue("truthy");

	const loaded = await module.loadConfig({});
	const defaultConfig = configSchema.parse(undefined);

	expect(infoSpy).toHaveBeenCalled();
	expect(warnSpy).not.toHaveBeenCalled();
	expect(loaded?.verbose).toBe(defaultConfig?.verbose);
	expect(loaded?.defaultLanguage).toBe(defaultConfig?.defaultLanguage);
});

it("warns the user when the supplied config cannot be found", async () => {
	const infoSpy = vi.spyOn(logger, "INFO");
	const warnSpy = vi.spyOn(logger, "WARN");

	searchMock.mock.mockResolvedValue("");

	const loaded = await module.loadConfig({ config: "./schema.js" });
	const defaultConfig = configSchema.parse(undefined);

	expect(infoSpy).toHaveBeenCalled();
	expect(warnSpy).toHaveBeenCalled();
	expect(loaded?.verbose).toBe(defaultConfig?.verbose);
	expect(loaded?.defaultLanguage).toBe(defaultConfig?.defaultLanguage);
});
