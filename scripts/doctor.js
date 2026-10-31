#!/usr/bin/env node
/**
 * Environment health check for `pnpm run doctor`.
 *
 * Prints the Node.js and pnpm versions in use next to the versions this
 * project expects, and how many package scripts are available.
 */
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * Compare the running Node.js major version with the `engines.node` range.
 * @param {string} required - The `engines.node` value, e.g. `>=26.0.0`
 * @returns {string} A status line
 */
function nodeStatus(required) {
  const requiredMajor = Number.parseInt(required.replace(/^[^\d]*/, ''), 10);
  const currentMajor = Number.parseInt(process.versions.node, 10);
  const ok = Number.isNaN(requiredMajor) || currentMajor >= requiredMajor;
  return `Node.js: ${process.version} (required ${required}) ${ok ? '✓' : '✗'}`;
}

/**
 * Report the pnpm version that launched this script, if any.
 * @param {string} expected - The `packageManager` value, e.g. `pnpm@12.16.1`
 * @returns {string} A status line
 */
function pnpmStatus(expected) {
  const expectedVersion = expected.replace(/^pnpm@/, '');
  const match = /pnpm\/(\S+)/.exec(process.env.npm_config_user_agent ?? '');
  if (!match) {
    return `pnpm: not detected (expected ${expectedVersion}; run this via \`pnpm run doctor\`)`;
  }
  const ok = match[1] === expectedVersion;
  return `pnpm: ${match[1]} (expected ${expectedVersion}) ${ok ? '✓' : '✗'}`;
}

console.log(nodeStatus(packageJson.engines.node));
console.log(pnpmStatus(packageJson.packageManager));
console.log(
  `Scripts: ${Object.keys(packageJson.scripts).length} available (run \`pnpm run help\`)`,
);
