import type { HookContext } from "@pnpm/hooks.pnpmfile";
import type { LockfileObject } from "@pnpm/lockfile.types";
import type { BaseManifest } from "@pnpm/types";

export type AfterAllResolvedHook = (
	lockfile: LockfileObject,
	context: HookContext,
) => LockfileObject | Promise<LockfileObject>;

export type BeforePackingHook<PackageJson extends BaseManifest = BaseManifest> =
	(pkg: PackageJson) => PackageJson | Promise<PackageJson>;

export type ImportPackageHook = (
	destinationDirectory: string,
	options: ImportPackageOptions,
) => Promise<string | undefined>;

export type ImportPackageOptions = Partial<{
	disableRelinkLocalDirDeps: boolean;
	filesMap: Record<string, string>;
	force: boolean;
	keepModulesDir: boolean;
	resolvedFrom: string;
}>;

export type PnpmFileHooks = Partial<{
	/** https://pnpm.io/pnpmfile#hooksafterallresolvedlockfile-context-lockfile--promiselockfile */
	afterAllResolved: AfterAllResolvedHook;

	/** https://pnpm.io/pnpmfile#hooksbeforepackingpkg-pkg--promisepkg */
	beforePacking: BeforePackingHook;

	/**
	 * @deprecated Please use top level custom fetcher instead
	 *   https://pnpm.io/pnpmfile#hooksfetchers
	 */
	fetchers: unknown;

	/** https://pnpm.io/pnpmfile#hooksimportpackagedestinationdir-options-promisestring--undefined */
	importPackage: ImportPackageHook;

	/** https://pnpm.io/pnpmfile#hookspreresolutionoptions-promisevoid */
	preResolution: PreResolutionHook;

	/** https://pnpm.io/pnpmfile#hooksreadpackagepkg-context-pkg--promisepkg */
	readPackage: ReadPackageHook;

	/** https://pnpm.io/pnpmfile#hooksupdateconfigconfig-config--promiseconfig */
	updateConfig: UpdateConfigHook;
}>;

export type PnpmFinder = (context: PnpmFinderContext) => boolean;

export type PnpmFinderContext = {
	name: string;
	readManifest(): BaseManifest;
	version: string;
};

export type PnpmFinders = Record<string, PnpmFinder>;

export type PreResolutionHook = (
	options: PreResolutionOptions,
) => Promise<void>;

/** https://pnpm.io/pnpmfile#arguments-3 */
export type PreResolutionOptions = Partial<{
	currentLockfile: string;
	existsCurrentLockfile: boolean;
	existsNonEmptyWantedLockfile: boolean;
	lockfileDir: string;
	registries: Record<string, string>;
	storeDir: string;
	wantedLockfile: string;
}>;

export type ReadPackageHook = <PackageJson extends BaseManifest>(
	pkg: PackageJson,
	context: HookContext,
) => PackageJson | Promise<PackageJson>;

export type UpdateConfigHook = <Config extends Record<string, string>>(
	config: Config,
) => Config | Promise<Config>;
