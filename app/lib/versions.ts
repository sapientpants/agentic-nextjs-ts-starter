import packageJson from '../../package.json';

/**
 * Strip range operators, package prefixes and trailing qualifiers from a
 * semver spec, keeping only the dotted number.
 * @example
 * cleanVersion('^6.0.3') // '6.0.3'
 * cleanVersion('>=26.0.0') // '26.0.0'
 * cleanVersion('tool@1.2.3') // '1.2.3'
 * @param {string} spec - A version spec such as `^6.0.3`, `>=26.0.0` or `tool@1.2.3` (the `packageManager` form).
 * @returns {string} The dotted version number, or an empty string when none is present.
 */
export function cleanVersion(spec: string): string {
  const afterAt = spec.includes('@') ? spec.slice(spec.lastIndexOf('@') + 1) : spec;
  const match = /\d[\d.]*/.exec(afterAt);
  let version = match?.[0] ?? '';
  while (version.endsWith('.')) {
    version = version.slice(0, -1);
  }
  return version;
}

/**
 * Return only the major component of a semver spec.
 * @example
 * majorVersion('>=26.0.0') // '26'
 * @param {string} spec - A version spec accepted by {@link cleanVersion}.
 * @returns {string} The major version, or an empty string when none is present.
 */
export function majorVersion(spec: string): string {
  return cleanVersion(spec).split('.').slice(0, 1).join('.');
}

/**
 * Return the major.minor components of a semver spec.
 * @example
 * minorVersion('^6.0.3') // '6.0'
 * @param {string} spec - A version spec accepted by {@link cleanVersion}.
 * @returns {string} The major.minor version (or just the major when no minor exists).
 */
export function minorVersion(spec: string): string {
  return cleanVersion(spec).split('.').slice(0, 2).join('.');
}

/**
 * Tool versions derived from package.json so the homepage never drifts
 * from the versions the project actually pins.
 */
export const toolVersions = {
  next: majorVersion(packageJson.dependencies.next),
  react: majorVersion(packageJson.dependencies.react),
  typescript: minorVersion(packageJson.devDependencies.typescript),
  node: majorVersion(packageJson.engines.node),
  pnpm: cleanVersion(packageJson.packageManager),
} as const;
