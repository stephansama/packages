// https://docs.github.com/en/actions/reference/workflows-and-actions/variables#default-environment-variables

declare global {
	namespace NodeJS {
		interface ProcessEnv extends GitHubEnvironments {}
	}
}

interface GitHubEnvironments {
	/** @description Always set to true. */
	readonly CI: "true";

	/**
	 * @description
	 * The name of the base ref or target branch of the pull request in a workflow run.
	 * This is only set when the event that triggers a workflow run is
	 * either `pull_request` or `pull_request_target`.
	 * For example, `main`.
	 */
	readonly GITHUB_BASE_REF?: string;

	/**
	 * @description
	 * The path on the runner to the file that sets variables from workflow commands.
	 * The path to this file is unique to the current step and changes for each step in a job.
	 * For example, `/home/\*\*\/_runner_file_commands/env-89345`.
	 * For more information, see [Workflow](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable) commands for GitHub Actions.
	 */
	readonly GITHUB_ENV?: string;

	/**
	 * @description
	 * The name of the event that triggered the workflow.
	 * For example, `workflow_dispatch`.
	 */
	readonly GITHUB_EVENT_NAME: string;

	/**
	 * @description
	 * The head ref or source branch of the pull request in a workflow run.
	 * This property is only set when the event that triggers a workflow
	 * run is either `pull_request` or `pull_request_target`.
	 * For example, `feature-branch-1`.
	 */
	readonly GITHUB_HEAD_REF?: string;

	/**
	 * @description
	 * The `job_id` of the current job.
	 * For example, `greeting_job`.
	 */
	readonly GITHUB_JOB: string;

	/**
	 * @description
	 * The path on the runner to the file that sets
	 * the current step's outputs from workflow commands.
	 * The path to this file is unique to the current step
	 * and changes for each step in a job.
	 * For example, `/home/\*\*\/set_output_a50`.
	 * For more information, see Workflow commands for GitHub Actions.
	 */
	readonly GITHUB_OUTPUT: string;

	/**
	 * @description
	 * The fully-formed ref of the branch or tag that triggered the workflow run.
	 * For workflows triggered by `push`, this is the branch or tag ref that was pushed.
	 * For workflows triggered by `pull_request`, this is the pull request merge branch.
	 * For workflows triggered by `release`, this is the release tag created.
	 * For other triggers, this is the branch or tag ref that triggered the workflow run.
	 * This is only set if a branch or tag is available for the event type.
	 * The ref given is fully-formed, meaning that for branches the format is `refs/heads/<branch_name>`.
	 * For pull requests events except `pull_request_target`, it is `refs/pull/<pr_number>/merge`.
	 * pull_request_target events have the ref from the base branch.
	 * For tags it is `refs/tags/<tag_name>`.
	 * For example, `refs/heads/feature-branch-1`.
	 */
	readonly GITHUB_REF?: string;

	/**
	 * @description
	 * The short ref name of the branch or tag that triggered the workflow run.
	 * This value matches the branch or tag name shown on GitHub.
	 * For example, `feature-branch-1`.
	 * For pull requests, the format is `<pr_number>/merge`.
	 */
	readonly GITHUB_REF_NAME: string;

	/**
	 * @description
	 * `true` if branch protections or rulesets are configured for the ref that triggered the workflow run.
	 */
	readonly GITHUB_REF_PROTECTED?: "true";

	/**
	 * @description
	 * The type of ref that triggered the workflow run.
	 * Valid values are `branch` or `tag`.
	 */
	readonly GITHUB_REF_TYPE: "branch" | "tag";

	/**
	 * @description
	 * The owner and repository name.
	 * For example, `stephansama/actions`.
	 */
	readonly GITHUB_REPOSITORY: string;

	/**
	 * @description
	 * The ID of the repository.
	 * For example, `123456789`.
	 * Note that this is different from the repository name
	 */
	readonly GITHUB_REPOSITORY_ID: string;

	/**
	 * @description
	 * The repository owner's name.
	 * For example, stephansama.
	 */
	readonly GITHUB_REPOSITORY_OWNER: string;

	/**
	 * @description
	 * The repository owner's account ID.
	 * For example, `1234567`.
	 * Note that this is different from the owner's name.
	 */
	readonly GITHUB_REPOSITORY_OWNER_ID: string;

	/**
	 * @description
	 * The commit SHA that triggered the workflow.
	 * The value of this commit SHA depends on the event that triggered the workflow.
	 * For more information, see Events that trigger workflows.
	 * For example, `ffac537e6cbbf934b08745a378932722df287a53`.
	 */
	readonly GITHUB_SHA: string;

	/**
	 * @description
	 * The architecture of the runner executing the job.
	 * Possible values are `X86`, `X64`, `ARM`, or `ARM64`.
	 */
	readonly RUNNER_ARCH: "ARM64" | "ARM" | "X64" | "X86";

	/**
	 * @description
	 * This is set only if debug logging is enabled, and always has the value of 1.
	 * It can be useful as an indicator to enable additional debugging or verbose logging in your own job steps.
	 */
	readonly RUNNER_DEBUG?: "1";

	/**
	 * @description
	 * The environment of the runner executing the job.
	 * Possible values are: `github-hosted` for GitHub-hosted runners provided by GitHub,
	 * and `self-hosted` for self-hosted runners configured by the repository owner.
	 */
	readonly RUNNER_ENVIRONMENT: "github-hosted" | "self-hosted";

	/**
	 * @description
	 * The name of the runner executing the job.
	 * This name may not be unique in a workflow run as runners at the repository
	 * and organization levels could use the same name.
	 * For example, `Hosted Agent`
	 */
	readonly RUNNER_NAME: string;

	/**
	 * @description
	 * The operating system of the runner executing the job.
	 * Possible values are `Linux`, `Windows`, or `macOS`.
	 * For example, `Windows`
	 *
	 */
	readonly RUNNER_OS: "Linux" | "macOS" | "Windows";
}

export {};
