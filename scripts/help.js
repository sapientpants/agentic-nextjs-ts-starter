#!/usr/bin/env node
/**
 * List every package script for `pnpm run help`.
 *
 * Prints the scripts in alphabetical order with the command each one runs.
 */
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const names = Object.keys(packageJson.scripts).sort();
const width = Math.max(...names.map((name) => name.length));

console.log('Available commands:');
for (const name of names) {
  console.log(`  pnpm ${name.padEnd(width)}  ${packageJson.scripts[name]}`);
}
