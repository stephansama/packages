import { command } from "cleye";

import type { CliArguments } from "@/src/cli";

export const meta = command({
	name: "generate",
});

export async function act(arguments_: CliArguments) {
	await Promise.resolve({});
	console.info(arguments_);
	// TODO: generate default configuration
	// TODO: generate rules directory
}
