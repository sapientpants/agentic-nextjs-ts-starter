#!/usr/bin/env bash
#
# check-version-drift.sh — Ensure docs/configs match package.json versions.
#
# Reads pnpm packageManager, engines.node, and typescript dep from package.json,
# then greps docs/ and AGENTS.md for version strings and fails if any drift
# is detected.
#
# Also fails on references to the predecessor Node starter layout (src/,
# dist/, `pnpm verify`, agentic-node-ts-starter) so the docs cannot drift
# back to describing a project structure that no longer exists.
#
# Exit codes:
#   0 — no drift found
#   1 — drift detected or script error

set -euo pipefail

export LC_ALL=C

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE_JSON="$ROOT_DIR/package.json"

# All doc paths below are relative to the repo root; run from anywhere.
cd "$ROOT_DIR"

# ── helpers ──────────────────────────────────────────────────────────────────

die() { echo "version-drift: $*" >&2; exit 1; }

grep_version() {
  python3 -c "
import json, sys
pkg = json.load(open(sys.argv[1]))
key = sys.argv[2]
parts = key.split('.')
val = pkg
for p in parts:
  val = val[p]
if isinstance(val, dict):
  val = val.get('version', '')
print(str(val) or '')
" "$PACKAGE_JSON" "$1"
}

# ── canonical versions ────────────────────────────────────────────────────────

PNPM_VER=$(grep_version 'packageManager' | sed 's/^pnpm@//')
NODE_VER=$(grep_version 'engines.node' | sed 's/^>=//')
TS_VER=$(grep_version 'devDependencies.typescript' | sed 's/^[\^~]//')

[ -z "$PNPM_VER" ] && die "Could not extract pnpm version from package.json"
[ -z "$NODE_VER"  ] && die "Could not extract node version from package.json"
[ -z "$TS_VER"    ] && die "Could not extract typescript version from package.json"

echo "  pnpm=$PNPM_VER  node=$NODE_VER  typescript=$TS_VER" >&2

# ── scan ──────────────────────────────────────────────────────────────────────

FOUND_DRIFT=0

check_docs() {
  local file="$1"

  # pnpm version references (pnpm@X.Y.Z or "pnpm": "X.Y.Z")
  local pnpm_refs
  pnpm_refs=$(grep -oE 'pnpm@[0-9]+\.[0-9]+\.[0-9]+' "$file" 2>/dev/null || true)
  for ref in $pnpm_refs; do
    local v
    v=$(echo "$ref" | sed 's/^pnpm@//' | tr -d '[:space:]')
    [ "$v" != "$PNPM_VER" ] && { echo "  $file: $ref  (expected pnpm@$PNPM_VER)"; FOUND_DRIFT=1; }
  done

  # node version references (node@X or "node": "X")
  local node_refs
  node_refs=$(grep -oE 'node@[0-9]+' "$file" 2>/dev/null || true)
  for ref in $node_refs; do
    local v
    v=$(echo "$ref" | sed 's/^node@//' | tr -d '[:space:]')
    # Accept partial match: node@24 is valid when package.json has >=24.0.0
    local _major="${v%%.*}"
    local _pkg_major="${NODE_VER%%.*}"
    [ "$_major" != "$_pkg_major" ] && { echo "  $file: $ref  (expected node@$NODE_VER)"; FOUND_DRIFT=1; }
  done

  # typescript version references (only version field, not package names)
  local ts_refs
  ts_refs=$(grep -oE '"typescript"[":= ]+["\x27]?[\^~]?[0-9]+\.[0-9]+\.[0-9]+' "$file" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)
  for ref in $ts_refs; do
    [ "$ref" != "$TS_VER" ] && { echo "  $file: typescript $ref  (expected typescript $TS_VER)"; FOUND_DRIFT=1; }
  done
  return 0
}

# Stale references to the predecessor project (agentic-node-ts-starter).
# Each entry is "<extended regex>@@<human description>". The leading
# character class keeps e.g. "app/src/" or "distinct/" from matching.
STALE_PATTERNS=(
  '(^|[^A-Za-z0-9_./-])src/@@src/ directory (code lives in app/)'
  '(^|[^A-Za-z0-9_./-])dist/@@dist/ output (Next.js builds to .next/)'
  'pnpm verify@@pnpm verify (use pnpm precommit or pnpm quick-check)'
  'agentic-node-ts-starter@@old project name (now agentic-nextjs-ts-starter)'
  'docs/CONFIG\.md@@docs/CONFIG.md (file does not exist)'
)

check_stale() {
  local file="$1"
  local entry pattern desc hits
  for entry in "${STALE_PATTERNS[@]}"; do
    pattern="${entry%%@@*}"
    desc="${entry#*@@}"
    hits=$(grep -nE "$pattern" "$file" 2>/dev/null || true)
    [ -z "$hits" ] && continue
    while IFS= read -r hit; do
      echo "  $file:${hit%%:*}: stale reference to $desc"
    done <<< "$hits"
    FOUND_DRIFT=1
  done
  return 0
}

# Scan all docs and AGENTS.md (skip node_modules)
for f in AGENTS.md docs/*.md; do
  [ -f "$f" ] && check_docs "$f"
done

# Also scan package.json itself for consistency (packageManager field)
check_docs "$PACKAGE_JSON"

# Stale-layout scan: top-level docs plus docs/ (ADRs under docs/architecture
# are historical records and intentionally excluded).
for f in README.md CONTRIBUTING.md SECURITY.md AGENTS.md .github/WORKFLOWS.md docs/*.md; do
  [ -f "$f" ] && check_stale "$f"
done

if [ "$FOUND_DRIFT" -eq 1 ]; then
  die "Drift detected — please align documentation with package.json and the Next.js layout (app/, .next/, pnpm precommit)"
fi

echo "  No version drift detected." >&2
