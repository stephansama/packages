import { command } from "cleye";

import type { arguments_ as CliArguments } from "../cli";

export const meta = command({
	name: "generate",
});

export async function act(arguments_: typeof CliArguments) {
	// TODO: generate default configuration
	// TODO: generate rules directory
}
