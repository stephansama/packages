<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import SocialShareLink from "./SocialShareLink.svelte";
	import { fn } from "storybook/test";
	import * as networks from "./networks.json";

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: "SocialShareLink",
		component: SocialShareLink,
		tags: ["autodocs"],
		argTypes: {
			url: { type: "string" },
			network: {
				type: "string",
				options: Object.keys(networks),
				control: { type: "select" },
			},
			label: { type: "string" },
			styled: { type: "boolean" },
		},
		args: {
			onclick: fn(),
		},
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Styled"
	args={{ url: "https://stephansama.info", network: "bluesky", styled: true }}
/>

<Story
	name="Unstyled"
	args={{ url: "https://stephansama.info", network: "bluesky", styled: false }}
/>
