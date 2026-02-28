declare global {
	namespace NodeJS {
		interface ProcessEnv extends Partial<LighthouseCiEnvironments> {}
	}
}

interface LighthouseCiEnvironments {
	LHCI_BUILD_CONTEXT__ANCESTOR_HASH: string;
	LHCI_BUILD_CONTEXT__AUTHOR: string;
	LHCI_BUILD_CONTEXT__AVATAR_URL: string;
	LHCI_BUILD_CONTEXT__COMMIT_MESSAGE: string;
	LHCI_BUILD_CONTEXT__COMMIT_TIME: string;
	LHCI_BUILD_CONTEXT__CURRENT_BRANCH: string;
	LHCI_BUILD_CONTEXT__CURRENT_HASH: string;
	LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL: string;
	LHCI_BUILD_CONTEXT__GIT_REMOTE: string;
	LHCI_BUILD_CONTEXT__GITHUB_REPO_SLUG: string;
	LHCI_SERVER_BASE_URL: string;
	LHCI_TOKEN: string;
	LHCI_UPLOAD__TARGET: string;
}

export {};
