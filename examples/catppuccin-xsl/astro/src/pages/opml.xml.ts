import { generateOpml, parseOpml } from "feedsmith";

export async function GET() {
	const res = await fetch("https://www.xml.style/demo/opml.xml");
	const text = await res.text();
	return new Response(
		// @ts-expect-error types slightly misalign
		generateOpml(parseOpml(text), {
			stylesheets: [
				{
					href: "/opml.xsl",
					title: "Catppuccin OPML feed",
					type: "text/xsl",
				},
			],
		}),
		{
			// (These headers are required to style feeds for users with Safari on iOS/Mac.)
			headers: new Headers({
				"Content-Type": "application/xml",
				"x-content-type-options": "nosniff",
			}),
		},
	);
}
