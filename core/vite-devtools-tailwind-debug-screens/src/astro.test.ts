import type { Plugin } from "vite";

import { describe, expect, it, vi } from "vitest";

import tailwindDebugScreensIntegration from "./astro";
import { CLIENT_SOURCE } from "./client";

const PACKAGE_NAME = "@stephansama/vite-devtools-tailwind-debug-screens";

describe("tailwindDebugScreensIntegration", () => {
	it("returns an AstroIntegration with the package name and one hook", () => {
		const integration = tailwindDebugScreensIntegration();
		expect(integration.name).toBe(PACKAGE_NAME);
		expect(Object.keys(integration.hooks)).toEqual(["astro:config:setup"]);
	});

	it("registers the vite plugin and injects the client script during `astro dev`", async () => {
		const { hooks } = tailwindDebugScreensIntegration();
		const { injectScript, updateConfig } = await runConfigSetup(hooks, {
			command: "dev",
		});

		expect(updateConfig).toHaveBeenCalledOnce();
		const [update] = updateConfig.mock.calls[0] as [
			{ vite: { plugins: Plugin[] } },
		];
		expect(update.vite.plugins).toHaveLength(1);
		expect(update.vite.plugins[0].name).toBe(PACKAGE_NAME);
		expect(update.vite.plugins[0].apply).toBe("serve");

		expect(injectScript).toHaveBeenCalledExactlyOnceWith(
			"page",
			CLIENT_SOURCE,
		);
	});

	it.each(["build", "preview", "sync"] as const)(
		"does nothing during `astro %s`",
		async (command) => {
			const { hooks } = tailwindDebugScreensIntegration();
			const { injectScript, updateConfig } = await runConfigSetup(hooks, {
				command,
			});
			expect(updateConfig).not.toHaveBeenCalled();
			expect(injectScript).not.toHaveBeenCalled();
		},
	);

	it("threads options through to the registered vite plugin", async () => {
		const screens = [{ name: "mobile", value: "480px" }];
		const { hooks } = tailwindDebugScreensIntegration({ screens });
		const { updateConfig } = await runConfigSetup(hooks, {
			command: "dev",
		});
		const [update] = updateConfig.mock.calls[0] as [
			{ vite: { plugins: Plugin[] } },
		];
		const plugin = update.vite.plugins[0];

		// verify the plugin's own transformIndexHtml still references the
		// middleware endpoint - a smoke test that we handed off a live plugin
		// rather than a stub
		const transform = plugin.transformIndexHtml as unknown as {
			handler: () => Array<{ children: string }>;
		};
		const tags = transform.handler();
		expect(tags[0].children).toContain('fetch("/__vdtds/width"');

		// and the options survived the round trip: register the dock and
		// confirm the custom screens name lands in the initial spec
		const context = createFakeDevelopmentToolsContext();
		void plugin.devtools?.setup(context.ctx);
		const spec = context.rendererCalls[0] as {
			elements: { table: { props: { data: Record<string, string> } } };
		};
		expect(spec.elements.table.props.data).toEqual({
			mobile: "min-width: 480px",
		});
	});
});

// ---------- helpers ----------

// the `devtools` field on `Plugin` is augmented by @vitejs/devtools-kit; the
// augmentation reaches this file transitively through `./astro` -> `./index`
type DevelopmentToolsSetupArguments = Parameters<
	NonNullable<NonNullable<Plugin["devtools"]>["setup"]>
>[0];

interface FakeContext {
	ctx: DevelopmentToolsSetupArguments;
	rendererCalls: Array<unknown>;
}

function createFakeDevelopmentToolsContext(): FakeContext {
	const rendererCalls: Array<unknown> = [];
	const context = {
		createJsonRenderer: (spec: unknown) => {
			rendererCalls.push(spec);
			return {
				updateSpec: () => {},
				view: { stateKey: "test-key" },
			};
		},
		docks: {
			register: () => ({ update: () => {} }),
		},
	} as unknown as DevelopmentToolsSetupArguments;

	return { ctx: context, rendererCalls };
}

async function runConfigSetup(
	hooks: ReturnType<typeof tailwindDebugScreensIntegration>["hooks"],
	options: { command: "build" | "dev" | "preview" | "sync" },
) {
	const injectScript = vi.fn();
	const updateConfig = vi.fn();
	const hook = hooks["astro:config:setup"];
	if (!hook) throw new Error("astro:config:setup hook missing");
	await hook({
		command: options.command,
		injectScript,
		updateConfig,
		// astro's real setup context has many more fields; the integration
		// only reads the three above, so a cast to `unknown` is enough
	} as unknown as Parameters<typeof hook>[0]);
	return { injectScript, updateConfig };
}
