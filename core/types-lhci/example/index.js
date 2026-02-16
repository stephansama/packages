import { lhciSchema } from "../dist/index.cjs";

/** @type {import('../dist/index.d.cts').LhciSchema} */
const config = {
	ci: {
		upload: {
			githubAppToken: process.env.GITHUB_APP_TOKEN,
			serverBaseUrl: "https://lhci.example.com",
			target: "lhci",
			token: "project-token",
		},
	},
};

// you can also verify the config object later

lhciSchema.parse(config);
