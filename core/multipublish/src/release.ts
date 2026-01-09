import * as fsp from "node:fs/promises";
import path from "node:path";
import * as z from "zod";

import type { Args } from "./args";

import { gitClean, readStdin } from "./util";

export type ReleaseSchema = z.infer<typeof releaseSchema>;
export const releaseSchema = z.object({
	name: z.string(),
	version: z.string().optional(),
});

export type ReleasesSchema = z.infer<typeof releasesSchema>;
export const releasesSchema = z.array(releaseSchema);

export type ChangesetStatusSchemaInput = z.input<typeof changesetStatusSchema>;
export type ChangesetStatusSchemaOutput = z.output<
	typeof changesetStatusSchema
>;

export const changesetStatusSchema = z
	.object({
		releases: z.array(
			z.object({ name: z.string(), newVersion: z.string() }),
		),
	})
	.transform<ReleasesSchema>((schema) =>
		schema.releases.map((release) => ({
			name: release.name,
			version: release.newVersion,
		})),
	);

export async function loadReleases(args: Args) {
	if (args.released) {
		return releasesSchema.parse(args.released.map((name) => ({ name })));
	}

	if (args.releasedFile) {
		const releasedFile = await fsp.readFile(args.releasedFile, "utf8");
		const releasedInfo = JSON.parse(releasedFile);
		return releasesSchema.parse(releasedInfo);
	}

	if (args.useChangesetStatus) {
		const changesetStatusPath = path.join(
			process.cwd(),
			args.useChangesetStatus,
		);

		const file = await fsp.readFile(changesetStatusPath, "utf8");

		gitClean(args.useChangesetStatus);

		return changesetStatusSchema.parse(JSON.parse(file));
	}

	const input = await readStdin();
	return releasesSchema.parse(input);
}
