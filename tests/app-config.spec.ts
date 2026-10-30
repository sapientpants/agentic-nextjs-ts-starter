import { describe, it, expect, vi } from 'vitest';
import { getAppName } from '../app/lib/app-config';

// Deliberately hardcoded rather than imported so the test pins the contract.
const DEFAULT_APP_NAME = 'agentic-nextjs-ts-starter';

describe('getAppName', () => {
  it('returns NEXT_PUBLIC_APP_NAME when it is set', () => {
    // `tests/setup.ts` sets `test-app`.
    expect(getAppName()).toBe('test-app');
    expect(getAppName()).not.toBe(DEFAULT_APP_NAME);
  });

  it('falls back to the default name when NEXT_PUBLIC_APP_NAME is unset', () => {
    // Undone automatically after each test via `unstubEnvs: true`.
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', undefined);
    expect(getAppName()).toBe(DEFAULT_APP_NAME);
  });

  it('falls back to the default name when NEXT_PUBLIC_APP_NAME is empty', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', '');
    expect(getAppName()).toBe(DEFAULT_APP_NAME);
  });

  it('reads the environment on every call', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'first');
    expect(getAppName()).toBe('first');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'second');
    expect(getAppName()).toBe('second');
  });
});
