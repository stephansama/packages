import type { Rollup } from "vite";

import { once } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { build, createServer } from "vite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import iconifySvgmap, { writeSprites } from "./index";
import { generateSprite } from "./sprite";
import { drainWorkerIcons, getState, loadCollection } from "./state";

const packageRoot = path.resolve(import.meta.dirname, "..");

const LOGOS_ASSET_REGEX = /^assets\/logos-[\w-]+\.svg$/;
const OCTICON_ASSET_REGEX = /^assets\/octicon-[\w-]+\.svg$/;
const SSR_HREF_REGEX = /"\/assets\/logos-[\w-]+\.svg#astro"/;
const RUNTIME_HREF_REGEX = /^\/_iconify\/logos\.svg\?v=\w+#astro$/;

let directory: string;

beforeEach(() => {
	directory = fs.mkdtempSync(path.join(os.tmpdir(), "iconify-svgmap-"));
	getState().runtime.clear();
	getState().root = packageRoot;
});

afterEach(() => {
	vi.restoreAllMocks();
	fs.rmSync(directory, { force: true, recursive: true });
});

async function buildEntry(source: string, ssr = false) {
	const result = await build({
		build: {
			rollupOptions: { input: writeEntry(source) },
			ssr,
			ssrEmitAssets: true,
			write: false,
		},
		configFile: false,
		logLevel: "silent",
		plugins: [iconifySvgmap({ root: packageRoot })],
		root: directory,
	});
	const [output] = (Array.isArray(result) ? result : [result]) as [
		Rollup.RollupOutput,
	];
	return output.output;
}

/** Ssr build of the `getIcon` runtime module */
async function buildRuntime() {
	const outDirectory = path.join(directory, "server");
	await build({
		build: {
			outDir: outDirectory,
			rollupOptions: {
				input: writeEntry(
					`export { getIcon } from "virtual:iconify-svgmap";`,
				),
				output: { entryFileNames: "[name].mjs" },
			},
			ssr: true,
		},
		configFile: false,
		logLevel: "silent",
		plugins: [iconifySvgmap({ root: packageRoot })],
		root: directory,
	});
	return path.join(outDirectory, "entry.mjs");
}

function writeEntry(source: string) {
	const entry = path.join(directory, "entry.js");
	fs.writeFileSync(entry, source);
	return entry;
}

describe("generateSprite", () => {
	it("creates one symbol per icon and reports missing icons", async () => {
		const collection = await loadCollection("logos");
		if (!collection) throw new Error("logos collection missing");

		const { missing, svg } = generateSprite(collection, [
			"astro",
			"alpinejs",
			"astro",
			"not-an-icon",
		]);

		expect(missing).toEqual(["not-an-icon"]);
		expect(svg.match(/<symbol /g)).toHaveLength(2);
		expect(svg).toContain('<symbol id="astro" viewBox=');
		expect(svg.indexOf('id="alpinejs"')).toBeLessThan(
			svg.indexOf('id="astro"'),
		);
	});
});

describe("static imports", () => {
	it("emits a hashed sprite containing only the imported icons", async () => {
		const output = await buildEntry(`
			import astro from "virtual:iconify-svgmap/logos/astro";
			import alpine from "virtual:iconify-svgmap/logos/alpinejs";
			import copilot from "virtual:iconify-svgmap/octicon/copilot-16";
			console.log(astro, alpine, copilot);
		`);

		const assets = output.filter((item) => item.type === "asset");
		expect(assets.map((asset) => asset.fileName).toSorted()).toEqual([
			expect.stringMatching(LOGOS_ASSET_REGEX),
			expect.stringMatching(OCTICON_ASSET_REGEX),
		]);

		const logos = assets.find((asset) => asset.fileName.includes("logos"))!;
		expect(String(logos.source).match(/<symbol /g)).toHaveLength(2);

		const chunk = output.find((item) => item.type === "chunk")!;
		expect(chunk.code).toContain(`"/${logos.fileName}#astro"`);
		expect(chunk.code).not.toContain("ROLLUP_FILE_URL");
	});

	it("resolves absolute hrefs in ssr builds", async () => {
		const output = await buildEntry(
			`export { default } from "virtual:iconify-svgmap/logos/astro";`,
			true,
		);
		const chunk = output.find((item) => item.type === "chunk")!;
		expect(chunk.code).toMatch(SSR_HREF_REGEX);
		expect(chunk.code).not.toContain("import.meta.url");
	});

	it("fails the build for unknown icons and packs", async () => {
		await expect(
			buildEntry(`import "virtual:iconify-svgmap/logos/not-an-icon";`),
		).rejects.toThrow('unable to find icon "not-an-icon"');
		await expect(
			buildEntry(`import "virtual:iconify-svgmap/not-a-pack/icon";`),
		).rejects.toThrow('unable to find icon pack "not-a-pack"');
	});
});

describe("getIcon", () => {
	it("registers icons while rendering and writes their sprites", async () => {
		const entry = await buildRuntime();
		const { getIcon } = (await import(pathToFileURL(entry).href)) as {
			getIcon: (pack: string, name: string) => string;
		};

		const names = ["astro", "alpinejs"];
		const hrefs = names.map((name) => getIcon("logos", name));
		expect(hrefs[0]).toMatch(RUNTIME_HREF_REGEX);
		expect(() => getIcon("../logos", "astro")).toThrow("invalid icon");

		const written = await writeSprites(pathToFileURL(directory));
		expect(written).toEqual([
			path.join(directory, "_iconify", "logos.svg"),
		]);

		const sprite = fs.readFileSync(written[0], "utf8");
		for (const name of names) expect(sprite).toContain(`id="${name}"`);
	});

	it("receives icons rendered in worker threads", async () => {
		const entry = await buildRuntime();
		const collection = await loadCollection("logos");
		const names = Object.keys(collection!.icons).slice(0, 100);

		// like sveltekit's prerenderer: the worker reports back over
		// `parentPort` right after rendering and stays alive
		const worker = new Worker(
			`const { parentPort, workerData } = require("node:worker_threads");
			import(workerData.entry).then(({ getIcon }) => {
				for (const name of workerData.names) getIcon("logos", name);
				parentPort.postMessage("done");
			});
			parentPort.on("message", () => {});`,
			{
				eval: true,
				workerData: { entry: pathToFileURL(entry).href, names },
			},
		);

		let written: string[];
		try {
			await once(worker, "message");
			// the channel listener usually has these by now; `writeSprites`
			// drains anything still queued
			written = await writeSprites(directory);
		} finally {
			await worker.terminate();
		}

		const sprite = fs.readFileSync(written[0], "utf8");
		for (const name of names) expect(sprite).toContain(`id="${name}"`);
	});

	it("drains icons queued by a worker thread synchronously", async () => {
		const entry = await buildRuntime();
		getState();
		// the worker flips this once it has posted its icons
		const posted = new Int32Array(new SharedArrayBuffer(4));
		const worker = new Worker(
			`const { workerData } = require("node:worker_threads");
			import(workerData.entry).then(({ getIcon }) => {
				getIcon("logos", "vitejs");
				getIcon("octicon", "copilot-16");
				Atomics.store(workerData.posted, 0, 1);
				Atomics.notify(workerData.posted, 0);
			});`,
			{
				eval: true,
				workerData: { entry: pathToFileURL(entry).href, posted },
			},
		);

		try {
			// block this thread without yielding to the event loop, so the
			// channel listener cannot run; only the drain can see the icons
			expect(Atomics.wait(posted, 0, 0, 10_000)).not.toBe("timed-out");
			drainWorkerIcons();
			expect(getState().runtime.get("logos")).toContain("vitejs");
			expect(getState().runtime.get("octicon")).toContain("copilot-16");
		} finally {
			await worker.terminate();
		}
	});
});

describe("dev server", () => {
	it("serves sprites from memory", async () => {
		const server = await createServer({
			configFile: false,
			logLevel: "silent",
			plugins: [iconifySvgmap({ root: packageRoot })],
			root: directory,
			server: { port: 0 },
		});

		try {
			await server.listen();
			const { getIcon } = (await server.ssrLoadModule(
				"virtual:iconify-svgmap",
			)) as { getIcon: (pack: string, name: string) => string };
			const { default: staticHref } = (await server.ssrLoadModule(
				"virtual:iconify-svgmap/logos/alpinejs",
			)) as { default: string };

			const href = getIcon("logos", "astro");
			expect(staticHref).toBe("/_iconify/logos.svg#alpinejs");

			const response = await fetch(
				new URL(href, server.resolvedUrls!.local[0]),
			);
			expect(response.headers.get("content-type")).toBe("image/svg+xml");

			const sprite = await response.text();
			expect(sprite).toContain('id="astro"');
			expect(sprite).toContain('id="alpinejs"');

			// icons rendered only in the browser are requested through the query
			const clientOnly = await fetch(
				new URL(
					"/_iconify/logos.svg?icon=vitejs",
					server.resolvedUrls!.local[0],
				),
			);
			expect(await clientOnly.text()).toContain('id="vitejs"');
		} finally {
			await server.close();
		}
	});
});
