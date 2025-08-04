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
	 * The name of the action currently running, or the `id` of a step.
	 * For example, for an action, `__repo-owner_name-of-action-repo`.
	 * GitHub removes special characters, and uses the name `__run`
	 * when the current step runs a script without an id.
	 * If you use the same script or action more than once in the same job,
	 * the name will include a suffix that consists of the sequence
	 * number preceded by an underscore.
	 * For example, the first script you run will have the name `__run`,
	 * and the second script will be named `__run_2`.
	 * Similarly, the second invocation of `actions/checkout` will be `actionscheckout2`.
	 */
	readonly GITHUB_ACTION: string;

	/**
	 * @description
	 * The path where an action is located.
	 * This property is only supported in composite actions.
	 * You can use this path to change directories
	 * to where the action is located and access other files in that same repository.
	 * For example, /home/runner/work/_actions/repo-owner/name-of-action-repo/v1.
	 */
	readonly GITHUB_ACTION_PATH: string;

	/**
	 * @description
	 * For a step executing an action,
	 * this is the owner and repository name of the action.
	 * For example, `actions/checkout`.
	 */
	readonly GITHUB_ACTION_REPOSITORY: string;

	/**
	 * @description
	 * The name of the person or app that initiated the workflow.
	 * For example, `stephansama`.
	 */
	readonly GITHUB_ACTOR: string;

	/**
	 * @description
	 * The account ID of the person or app that triggered the initial workflow run.
	 * For example, `1234567`.
	 * Note that this is different from the actor username.
	 */
	readonly GITHUB_ACTOR_ID: string;

	/**
	 * @description
	 * Returns the API URL.
	 * For example: `https://api.github.com`.
	 */
	readonly GITHUB_API_URL: string;

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
	 * For example, `/home/runner/work/_temp/_runner_file_commands/set_env_87406d6e-4979-4d42-98e1-3dab1f48b13a`.
	 * For more information, see
	 * [Workflow commands for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable).
	 */
	readonly GITHUB_ENV: string;

	/**
	 * @description
	 * The name of the event that triggered the workflow.
	 * For example, `workflow_dispatch`.
	 */
	readonly GITHUB_EVENT_NAME: string;

	/**
	 * @description
	 * The path to the file on the runner that contains the full event webhook payload.
	 * For example, `/github/workflow/event.json`.
	 */
	readonly GITHUB_EVENT_PATH: string;

	/**
	 * @description
	 * Returns the GraphQL API URL.
	 * For example: `https://api.github.com/graphql`.
	 */
	readonly GITHUB_GRAPHQL_URL: string;

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
	 * For more information, see
	 * [Workflow commands for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter).
	 */
	readonly GITHUB_OUTPUT: string;

	/**
	 * @description
	 * The path on the runner to the file that sets system PATH variables from workflow commands.
	 * The path to this file is unique to the current step and changes for each step in a job.
	 * For example, `/home/runner/work/_temp/_runner_file_commands/add_path_899b9445-ad4a-400c-aa89-249f18632cf5`.
	 * For more information, see
	 * [Workflow commands for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-system-path).
	 */
	readonly GITHUB_PATH: string;

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
	readonly GITHUB_REF_TYPE?: "branch" | "tag";

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
	 * The number of days that workflow run logs and artifacts are kept.
	 * For example, `90`.
	 */
	readonly GITHUB_RETENTION_DAYS: string;

	/**
	 * @description
	 * A unique number for each attempt of a particular workflow run in a repository.
	 * This number begins at `1` for the workflow run's first attempt, and increments with each re-run.
	 * For example, `3`.
	 */
	readonly GITHUB_RUN_ATTEMPT: string;

	/**
	 * @description
	 * A unique number for each workflow run within a repository.
	 * This number does not change if you re-run the workflow run.
	 * For example, `1658821493`
	 */
	readonly GITHUB_RUN_ID: string;

	/**
	 * @description
	 * A unique number for each run of a particular workflow in a repository.
	 * This number begins at `1` for the workflow's first run,
	 * and increments with each new run.
	 * This number does not change if you re-run the workflow run.
	 * For example, `3`.
	 */
	readonly GITHUB_RUN_NUMBER: string;

	/**
	 * @description
	 * The URL of the GitHub server.
	 * For example: `https://github.com`.
	 */
	readonly GITHUB_SERVER_URL: string;

	/**
	 * @description
	 * The commit SHA that triggered the workflow.
	 * The value of this commit SHA depends on the event that triggered the workflow.
	 * For more information, see [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
	 * For example, `ffac537e6cbbf934b08745a378932722df287a53`.
	 */
	readonly GITHUB_SHA: string;

	/**
	 * @description
	 * The path on the runner to the file that contains job summaries from workflow commands.
	 * The path to this file is unique to the current step and changes for each step in a job.
	 * For example, `/home/runner/_layout/_work/_temp/_runner_file_commands/step_summary_1cb22d7f-5663-41a8-9ffc-13472605c76c`.
	 * For more information, see
	 * [Workflow commands for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary).
	 */
	readonly GITHUB_STEP_SUMMARY: string;

	/**
	 * @description
	 * The username of the user that initiated the workflow run.
	 * If the workflow run is a re-run, this value may differ from `github.actor`.
	 * Any workflow re-runs will use the privileges of `github.actor`,
	 * even if the actor initiating the re-run (`github.triggering_actor`) has different privileges.
	 */
	readonly GITHUB_TRIGGERING_ACTOR: string;

	/**
	 * @description
	 * The name of the workflow.
	 * For example, `My test workflow`.
	 * If the workflow file doesn't specify a name,
	 * the value of this variable is the full path
	 * of the workflow file in the repository.
	 */
	readonly GITHUB_WORKFLOW: string;

	/**
	 * @description
	 * The ref path to the workflow.
	 * For example, `stephansama/packages/.github/workflows/my-workflow.yml@refs/heads/my_branch`.
	 */
	readonly GITHUB_WORKFLOW_REF: string;

	/** @description The commit SHA for the workflow file. */
	readonly GITHUB_WORKFLOW_SHA: string;

	/**
	 * @description
	 * The default working directory on the runner for steps,
	 * and the default location of your repository when using the checkout action.
	 * For example, `/home/runner/work/my-repo-name/my-repo-name`.
	 */
	readonly GITHUB_WORKSPACE: string;

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

	/**
	 * @description
	 * The path to a temporary directory on the runner.
	 * This directory is emptied at the beginning and end of each job.
	 * Note that files will not be removed if the runner's user account does not have permission to delete them.
	 * For example, `D:\a\_temp`
	 */
	readonly RUNNER_TEMP: string;

	/**
	 * @description
	 * The path to the directory containing preinstalled tools for GitHub-hosted runners.
	 * For more information, see [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-software).
	 * For example, `C:\hostedtoolcache\windows`
	 */
	readonly RUNNER_TOOL_CACHE: string;
}

export {};
