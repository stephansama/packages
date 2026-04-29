import * as cp from "node:child_process";
import * as fsp from "node:fs/promises";
import * as z from "zod";

import type { Arguments } from "./arguments";

import { gitClean, readStdin } from "./utilities";

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

export async function loadReleases(arguments_: Arguments) {
	if (arguments_.released) {
		return releasesSchema.parse(
			arguments_.released.map((name) => ({ name })),
		);
	}

	if (arguments_.releasedFile) {
		const releasedFile = await fsp.readFile(
			arguments_.releasedFile,
			"utf8",
		);
		return releasesSchema.parse(JSON.parse(releasedFile));
	}

	if (arguments_.useChangesetStatus) {
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
