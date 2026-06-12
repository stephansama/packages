export async function fetchResponse(input: string) {
	const response = await fetch(input);
	const type = response.headers.get("Content-Type");
	const arrayBuffer = await response.arrayBuffer();
	const base64 = Buffer.from(arrayBuffer).toString("base64");
	return `data:${type};base64,${base64}`;
}
