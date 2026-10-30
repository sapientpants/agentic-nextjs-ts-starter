import { describe, expect, vi } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { getAppName } from '../app/lib/app-config';

const DEFAULT_APP_NAME = 'agentic-nextjs-ts-starter';

describe('getAppName property tests', () => {
  it.prop([fc.string({ minLength: 1 })])('round-trips any non-empty env value', (name) => {
    // Undone automatically after each test via `unstubEnvs: true`.
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', name);
    expect(getAppName()).toBe(name);
  });

  it.prop([fc.constantFrom<string | undefined>(undefined, '')])(
    'returns the default for unset or empty env values',
    (value) => {
      vi.stubEnv('NEXT_PUBLIC_APP_NAME', value);
      expect(getAppName()).toBe(DEFAULT_APP_NAME);
    },
  );

  it.prop([fc.option(fc.string(), { nil: undefined })])(
    'never returns an empty string',
    (value) => {
      vi.stubEnv('NEXT_PUBLIC_APP_NAME', value);
      expect(getAppName().length).toBeGreaterThan(0);
    },
  );
});
