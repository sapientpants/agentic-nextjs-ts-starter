import { describe, expect } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { cleanVersion, majorVersion, minorVersion } from '../app/lib/versions';

const semver = fc
  .tuple(fc.nat({ max: 999 }), fc.nat({ max: 999 }), fc.nat({ max: 999 }))
  .map(([major, minor, patch]) => ({ major, minor, patch, text: `${major}.${minor}.${patch}` }));

const prefix = fc.constantFrom('', '^', '~', '>=', '>', '<=', '=', 'pnpm@', 'node@', '@scope/pkg@');

describe('version helpers (property)', () => {
  it.prop([prefix, semver])('cleanVersion round-trips a prefixed semver', (p, v) => {
    expect(cleanVersion(`${p}${v.text}`)).toBe(v.text);
  });

  it.prop([prefix, semver])('majorVersion returns the major component', (p, v) => {
    expect(majorVersion(`${p}${v.text}`)).toBe(String(v.major));
  });

  it.prop([prefix, semver])('minorVersion returns major.minor', (p, v) => {
    expect(minorVersion(`${p}${v.text}`)).toBe(`${v.major}.${v.minor}`);
  });

  it.prop([semver])('cleanVersion is idempotent', (v) => {
    expect(cleanVersion(cleanVersion(v.text))).toBe(cleanVersion(v.text));
  });
});
