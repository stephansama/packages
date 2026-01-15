import { detect } from "package-manager-detector/detect";

export type AgentName = NonNullable<Awaited<ReturnType<typeof detect>>>["name"];

let _detected: AgentName | null = null;

export async function detectPackageManager() {
	if (_detected) return _detected;

	const detected = await detect();
	if (!detected) throw new Error("unable to detect package manager");

	_detected = detected.name;

	return _detected;
}
