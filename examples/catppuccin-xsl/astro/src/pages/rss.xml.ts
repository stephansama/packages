import { generateRssFeed } from "feedsmith";

export async function GET() {
	const feed = generateRssFeed(
		{
			description: "stephansama blog feed",
			items: [
				{
					createdAt: new Date(),
					description: "first article",
					id: "article-1",
					title: "Article One",
				},
				{
					createdAt: new Date(),
					description: "second article",
					id: "article-2",
					title: "Article Two",
				},
			].map((article) => ({
				authors: ["stephanrandle@hotmail.com (Stephan Randle)"],
				description: article.description,
				link: `/articles/${article?.id}`,
				pubDate: article.createdAt,
				title: article.title,
			})),
			language: "en-US",
			pubDate: new Date(),
			title: "stephansama blog feed",
		},
		{
			stylesheets: [
				{
					href: "/rss.xsl",
					title: "Catppuccin pretty feed",
					type: "text/xsl",
				},
			],
		},
	);

	return new Response(feed, {
		// (These headers are required to style feeds for users with Safari on iOS/Mac.)
		headers: new Headers({
			"Content-Type": "application/xml",
			"x-content-type-options": "nosniff",
		}),
	});
}
