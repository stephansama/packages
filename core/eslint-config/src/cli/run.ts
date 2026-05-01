import * as prompts from "@clack/prompts";

export async function run() {
	const result = await prompts.text({
		message: "hello",
	});

	if (prompts.isCancel(result)) {
		return;
	}
}
