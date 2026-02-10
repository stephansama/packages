import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
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

export type ChangesetStatusSchema = z.input<typeof changesetStatusSchema>;
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
		const changesetOutput = ".multipublish.status.json";
		cp.execFileSync("changeset", ["status", `--output=${changesetOutput}`]);

		const file = await fsp.readFile(changesetOutput, "utf8");

		gitClean(changesetOutput);

		return changesetStatusSchema.parse(JSON.parse(file));
	}

	const input = await readStdin();
	if (!input) throw new Error("no piped input provided");
	return releasesSchema.parse(JSON.parse(input));
}
