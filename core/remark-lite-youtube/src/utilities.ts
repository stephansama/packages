const WWW_PREFIX = /^www\./;
const LEADING_SLASHES = /^\/+/;

/** Build the `<lite-youtube>` markup. `playLabel` is escaped for attribute use. */
export function constructLiteYoutube(
	videoId: string,
	playLabel?: string,
): string {
	const label = (playLabel ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;");
	return (
		'<lite-youtube videoid="' +
		videoId +
		'" playlabel="' +
		label +
		'"></lite-youtube>'
	);
}

/**
 * Extract a YouTube video id from any of the three URL shapes:
 *
 * - https://www.youtube.com/watch?v={id}
 * - https://youtu.be/{id}
 * - https://www.youtube.com/embed/{id}
 */
export function extractYoutubeId(input: string): string | undefined {
	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return;
	}

	const host = url.host.replace(WWW_PREFIX, "");

	if (host === "youtu.be") {
		const id = url.pathname.replace(LEADING_SLASHES, "").split("/")[0];
		return id || undefined;
	}

	if (host === "youtube.com" || host === "m.youtube.com") {
		if (url.pathname === "/watch") {
			return url.searchParams.get("v") ?? undefined;
		}
		if (url.pathname.startsWith("/embed/")) {
			const id = url.pathname.slice("/embed/".length).split("/")[0];
			return id || undefined;
		}
	}

	return;
}
