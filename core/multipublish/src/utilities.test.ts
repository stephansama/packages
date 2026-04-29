import { merge } from "es-toolkit/compat";
import * as fs from "node:fs";
import * as os from "node:os";
import * as process from "node:process";
import { describe, expect, it, vi } from "vitest";

import { chdir, gitClean, npmrcTemplate, readStdin } from "./utilities";

const mocks = vi.hoisted(() => ({
	asyncIterator: vi.fn(),
	on: vi.fn(),
	setEncoding: vi.fn(),
}));

vi.mock("node:process", async (importOriginal) => {
	const originalProcess = await importOriginal<typeof process>();
	return merge(originalProcess, {
		stdin: {
			on: mocks.on,
			setEncoding: mocks.setEncoding,
			[Symbol.asyncIterator]: mocks.asyncIterator,
		},
	});
});

describe("chdir", () => {
	it("should change directory, execute callback, and then change back", async () => {
		const initialDirectory = fs.realpathSync(process.cwd());
		const temporaryDirectory = fs.realpathSync(os.tmpdir());

		let callbackDirectory: string | undefined;

		await chdir(temporaryDirectory, () => {
			callbackDirectory = fs.realpathSync(process.cwd());
		});

		const finalDirectory = fs.realpathSync(process.cwd());

		expect(callbackDirectory).toBe(temporaryDirectory);
		expect(finalDirectory).toBe(initialDirectory);
	});
});

describe("gitClean", () => {
	it("should remove the specified file", () => {
		const temporaryFile = "dummy-file-for-testing.tmp";
		fs.writeFileSync(temporaryFile, "delete me");

		gitClean(temporaryFile);

		expect(fs.existsSync(temporaryFile)).toBe(false);
	});
});

describe("npmrcTemplate", () => {
	it("should generate correct .npmrc content", () => {
		const options = {
			authToken: "my-secret-token",
			registry: "https://registry.npmjs.org/",
			registryDomain: "registry.npmjs.org",
			scope: "@my-scope",
		};

		const expected = `
@my-scope:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=my-secret-token
`.trim();

		const result = npmrcTemplate(options);
		expect(result.trim()).toBe(expected);
	});
});

describe("readStdin", () => {
	it("should return null if stdin is a TTY", async () => {
		vi.mocked(process.stdin).isTTY = true;
		const result = await readStdin();
		expect(result).toBeNull();
	});

	it("should read from stdin", async () => {
		vi.mocked(process.stdin).isTTY = false;
		const input = "hello world";

		mocks.asyncIterator.mockImplementation(async function* () {
			yield await Promise.resolve(input);
		});

		const result = await readStdin();
		expect(result).toBe(input);
	});
});
