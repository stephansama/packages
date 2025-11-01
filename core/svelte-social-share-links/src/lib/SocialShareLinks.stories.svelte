<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import SocialShareLink from "./SocialShareLink.svelte";
	import { expect, fn, userEvent, waitFor, within } from "storybook/test";
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
				control: {
					type: "select",
				},
			},
		},
		args: {
			onclick: fn(),
		},
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Primary"
	args={{ primary: true, label: "Button" }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loginButton = canvas.getByRole("button", { name: /Log in/i });
		await expect(loginButton).toBeInTheDocument();
		await userEvent.click(loginButton);
		await waitFor(() => expect(loginButton).not.toBeInTheDocument());

		const logoutButton = canvas.getByRole("button", { name: /Log out/i });
		await expect(logoutButton).toBeInTheDocument();
	}}
/>

<Story name="Secondary" args={{ label: "Button" }} />

<Story name="Large" args={{ size: "large", label: "Button" }} />

<Story name="Small" args={{ size: "small", label: "Button" }} />
