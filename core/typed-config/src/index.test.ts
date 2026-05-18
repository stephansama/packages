import * as fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as z from "zod";

import { createConfig } from "./index";

const INVALID_CONFIG_PATTERN = /Invalid config/;

const schemaSchema = z.object({
	model: z.string().trim().default("llama2"),
	verbose: z.boolean().default(false),
});
const schema = schemaSchema;

let workdir = "";
const originalCwd = process.cwd();

beforeEach(async () => {
	workdir = await fsp.mkdtemp(path.join(os.tmpdir(), "typed-config-"));
	process.chdir(workdir);
});

afterEach(async () => {
	process.chdir(originalCwd);
	await fsp.rm(workdir, { force: true, recursive: true });
});

describe("createConfig", () => {
	it("returns defaults when no config file is found", async () => {
		const { config, filepath } = await createConfig({
			name: "ste-tc",
			schema,
		});
		expect(config).toEqual({ model: "llama2", verbose: false });
		expect(filepath).toBe(undefined);
	});

	it("loads a JSON config file", async () => {
		await fsp.writeFile(
			path.join(workdir, ".ste-tcrc.json"),
			JSON.stringify({ model: "gpt-4" }),
		);
		const { config, filepath } = await createConfig({
			name: "ste-tc",
			schema,
		});
		expect(config.model).toBe("gpt-4");
		expect(filepath).toContain(".ste-tcrc.json");
	});

	it("loads a TOML config file", async () => {
		await fsp
			.writeFile(
				path.join(workdir, ".config/.ste-tcrc.toml"),
				'model = "sonnet"\nverbose = true\n',
			)
			.catch(async () => {
				await fsp.mkdir(path.join(workdir, ".config"), {
					recursive: true,
				});
				await fsp.writeFile(
					path.join(workdir, ".config/.ste-tcrc.toml"),
					'model = "sonnet"\nverbose = true\n',
				);
			});
		const { config } = await createConfig({ name: "ste-tc", schema });
		expect(config.model).toBe("sonnet");
		expect(config.verbose).toBe(true);
	});

	it("merges explicit defaults under the loaded file", async () => {
		await fsp.writeFile(
			path.join(workdir, ".ste-tcrc.json"),
			JSON.stringify({ verbose: true }),
		);
		const { config } = await createConfig({
			defaults: { model: "claude" },
			name: "ste-tc",
			schema,
		});
		expect(config.model).toBe("claude");
		expect(config.verbose).toBe(true);
	});

	it("throws when the loaded config fails validation", async () => {
		await fsp.writeFile(
			path.join(workdir, ".ste-tcrc.json"),
			JSON.stringify({ verbose: "not-a-boolean" }),
		);
		await expect(createConfig({ name: "ste-tc", schema })).rejects.toThrow(
			INVALID_CONFIG_PATTERN,
		);
	});
});
