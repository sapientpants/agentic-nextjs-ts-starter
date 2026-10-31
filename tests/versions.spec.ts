import { describe, it, expect } from 'vitest';
import { cleanVersion, majorVersion, minorVersion, toolVersions } from '../app/lib/versions';
import packageJson from '../package.json';

describe('cleanVersion', () => {
  it('strips caret, tilde and range operators', () => {
    expect(cleanVersion('^6.0.3')).toBe('6.0.3');
    expect(cleanVersion('~1.2.3')).toBe('1.2.3');
    expect(cleanVersion('>=26.0.0')).toBe('26.0.0');
  });

  it('strips a package-manager prefix', () => {
    expect(cleanVersion('pnpm@12.16.1')).toBe('12.16.1');
    expect(cleanVersion('@scope/pkg@1.0.0')).toBe('1.0.0');
  });

  it('drops trailing dots left by a truncated spec', () => {
    expect(cleanVersion('12.')).toBe('12');
    expect(cleanVersion('1.2...')).toBe('1.2');
  });

  it('returns an empty string when no version digits exist', () => {
    expect(cleanVersion('latest')).toBe('');
    expect(cleanVersion('')).toBe('');
  });
});

describe('majorVersion and minorVersion', () => {
  it('returns the major component only', () => {
    expect(majorVersion('>=26.0.0')).toBe('26');
    expect(majorVersion('16.4.3')).toBe('16');
    expect(majorVersion('latest')).toBe('');
  });

  it('returns major.minor components', () => {
    expect(minorVersion('^6.0.3')).toBe('6.0');
    expect(minorVersion('19')).toBe('19');
  });
});

describe('toolVersions', () => {
  it('derives every entry from package.json', () => {
    expect(toolVersions.node).toBe(packageJson.engines.node.replace(/^>=/, '').split('.')[0]);
    expect(toolVersions.pnpm).toBe(packageJson.packageManager.replace(/^pnpm@/, ''));
    expect(toolVersions.next).toBe(packageJson.dependencies.next.split('.')[0]);
    expect(toolVersions.react).toBe(packageJson.dependencies.react.split('.')[0]);
    expect(toolVersions.typescript).toBe(
      packageJson.devDependencies.typescript.replace(/^\^/, '').split('.').slice(0, 2).join('.'),
    );
  });

  it('never contains range operators or empty values', () => {
    for (const value of Object.values(toolVersions)) {
      // Every dot-separated segment must be a plain integer (no ^, ~, >=, or blanks)
      for (const segment of value.split('.')) {
        expect(segment).toMatch(/^\d+$/);
      }
    }
  });
});
