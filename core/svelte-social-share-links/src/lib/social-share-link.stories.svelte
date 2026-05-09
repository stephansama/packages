<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { fn } from "storybook/test";

	import * as networks from "./networks.json";
	import SocialShareLink from "./social-share-link.svelte";

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		args: {
			onclick: fn(),
		},
		argTypes: {
			label: { type: "string" },
			network: {
				control: { type: "select" },
				options: Object.keys(networks),
				type: "string",
			},
			styled: { type: "boolean" },
			url: { type: "string" },
		},
		component: SocialShareLink,
		tags: ["autodocs"],
		title: "SocialShareLink",
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Styled"
	args={{ network: "bluesky", styled: true, url: "https://stephansama.info" }}
/>

<Story
	name="Unstyled"
	args={{ network: "bluesky", styled: false, url: "https://stephansama.info" }}
/>
