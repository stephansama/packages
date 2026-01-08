export type Changeset = { changesets: ChangesetElement[]; releases: Release[] };

export type ChangesetElement = {
	id: string;
	releases: ChangesetsRelease[];
	summary: string;
};

export type ChangesetsRelease = { name: string; type: string };

export type Release = {
	changesets: string[];
	name: string;
	newVersion: string;
	oldVersion: string;
	type: string;
};
