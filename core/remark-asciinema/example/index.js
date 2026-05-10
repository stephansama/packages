import { remark } from "remark";

import asciinema from "../dist/index.mjs";

export async function pipeline() {
	const file = await remark()
		.use(asciinema, { embedType: "script" })
		.process("Check out: https://asciinema.org/a/abc123");

	console.info(String(file));
}
