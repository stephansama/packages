import { command } from "cleye";

import type { cliArguments } from "@/src/cli";

export const meta = command({
	name: "generate",
});

export async function act(arguments_: typeof cliArguments) {
	// TODO: generate default configuration
	// TODO: generate rules directory
}
