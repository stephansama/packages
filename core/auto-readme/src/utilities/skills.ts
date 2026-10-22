import type { Skill, SkillsLock } from "./types";

import {
	GIT_SUFFIX,
	GITHUB_HOST,
	GITHUB_URL,
	HTTP_PROTOCOL,
	SKILLS_LOCK_FILE,
} from "./constants";
import { loadJsonBesideReadme } from "./json";

/** Resolve the repository url that a skill was installed from */
export function getSkillRepositoryUrl(skill: Skill): string | undefined {
	if (skill.sourceUrl && HTTP_PROTOCOL.test(skill.sourceUrl)) {
		return skill.sourceUrl;
	}
	if (!skill.source) return;
	if (HTTP_PROTOCOL.test(skill.source)) return skill.source;
	if (!skill.sourceType || skill.sourceType === "github") {
		return `${GITHUB_URL}/${skill.source}`;
	}
}

/** Resolve a url directly to the skill definition when possible */
export function getSkillUrl(skill: Skill): string | undefined {
	const repository = getSkillRepositoryUrl(skill);
	if (!repository) return;
	if (!skill.skillPath || !isGithubUrl(repository)) return repository;
	const base = repository.replace(GIT_SUFFIX, "");
	return `${base}/blob/${skill.ref || "HEAD"}/${skill.skillPath}`;
}

/** Load the `skills-lock.json` next to the readme when it exists */
export async function loadSkillsLock(readme: string) {
	return await loadJsonBesideReadme<SkillsLock>(readme, SKILLS_LOCK_FILE);
}

function isGithubUrl(input: string) {
	try {
		return new URL(input).hostname === GITHUB_HOST;
	} catch {
		return false;
	}
}
