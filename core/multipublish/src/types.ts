export type Changeset = {
	changesets: {
		id: string;
		releases: { name: string; type: string }[];
		summary: string;
	}[];
	releases: {
		changesets: string[];
		name: string;
		newVersion: string;
		oldVersion: string;
		type: string;
	}[];
};
