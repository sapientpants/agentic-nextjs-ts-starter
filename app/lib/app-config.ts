/** Fallback application name used when `NEXT_PUBLIC_APP_NAME` is unset or empty. */
const DEFAULT_APP_NAME = 'agentic-nextjs-ts-starter';

/**
 * Resolve the public application name.
 *
 * The environment is read on every call rather than at module load so that
 * runtime changes (for example `vi.stubEnv` in tests) are honoured.
 * @returns `NEXT_PUBLIC_APP_NAME` when set to a non-empty string, otherwise the default name.
 */
export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || DEFAULT_APP_NAME;
}
