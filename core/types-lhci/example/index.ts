import { lhciSchema, type LhciSchema } from "../dist/index.mjs";

const config = {
	ci: {
		upload: {
			githubAppToken: process.env.GITHUB_APP_TOKEN,
			serverBaseUrl: "https://lhci.example.com",
			target: "lhci",
			token: "project-token",
		},
	},
} satisfies LhciSchema;

// you can also verify the config object later

lhciSchema.parse(config);
