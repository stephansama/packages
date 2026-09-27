export const REPORT_PATH = "/__vdtds/width";

/**
 * Inline module script injected into the app's html. Sends viewport width
 * updates to the plugin via a POST to `REPORT_PATH` (served by the plugin's dev
 * middleware). Nothing is rendered on the page.
 */
export const CLIENT_SOURCE = `
if (typeof window !== "undefined") {
	let last = -1;
	let pending = 0;
	const post = () => {
		pending = 0;
		const width = window.innerWidth;
		if (width === last) return;
		last = width;
		fetch(${JSON.stringify(REPORT_PATH)}, {
			body: JSON.stringify({ width }),
			headers: { "content-type": "application/json" },
			keepalive: true,
			method: "POST",
		}).catch(() => {});
	};
	const schedule = () => {
		if (pending) return;
		pending = requestAnimationFrame(post);
	};
	window.addEventListener("resize", schedule, { passive: true });
	post();
}
`;
