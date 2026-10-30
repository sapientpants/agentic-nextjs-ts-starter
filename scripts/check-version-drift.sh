#!/usr/bin/env bash
#
# check-version-drift.sh — Ensure docs/configs match package.json versions.
#
# Reads pnpm packageManager, engines.node, and typescript dep from package.json
# and the coverage threshold from vitest.config.ts, then greps docs, scripts,
# workflows and app source for version/threshold strings (both the pnpm@X.Y.Z
# form and prose such as "pnpm 10", "Node.js 22+", "coverage below 80%") and
# fails if any drift is detected.
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

PNPM_MAJOR="${PNPM_VER%%.*}"
NODE_MAJOR="${NODE_VER%%.*}"

VITEST_CONFIG="$ROOT_DIR/vitest.config.ts"
COVERAGE_PCT=$(grep -oE '^[[:space:]]*lines:[[:space:]]*[0-9]+' "$VITEST_CONFIG" 2>/dev/null | grep -oE '[0-9]+$' | head -1 || true)
[ -z "$COVERAGE_PCT" ] && die "Could not extract coverage threshold (coverage.thresholds.lines) from vitest.config.ts"

echo "  pnpm=$PNPM_VER  node=$NODE_VER  typescript=$TS_VER  coverage=${COVERAGE_PCT}%" >&2

# ── scan ──────────────────────────────────────────────────────────────────────

FOUND_DRIFT=0

# Report one drift hit. Usage: report <file> <matched text> <expected text>
report() {
  echo "  $1: $2  (expected $3)"
  FOUND_DRIFT=1
}

# Compare a referenced version against the canonical one. A bare major
# ("pnpm 12", "Node 26") only has to match the major; anything more specific
# ("pnpm 12.16.1") has to match the full version.
version_matches() {
  local ref="$1" full="$2" major="$3"
  case "$ref" in
    *.*) [ "$ref" = "$full" ] ;;
    *)   [ "$ref" = "$major" ] ;;
  esac
}

# pnpm references: pnpm@X.Y.Z, "pnpm X", "pnpm X.Y.Z", "pnpm X+"
check_pnpm() {
  local file="$1" ref v
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    v=$(echo "$ref" | grep -oE '[0-9]+(\.[0-9]+)*')
    version_matches "$v" "$PNPM_VER" "$PNPM_MAJOR" || report "$file" "$ref" "pnpm $PNPM_VER"
  done < <(grep -oE '(^|[^A-Za-z0-9_/.-])pnpm[ @]v?[0-9]+(\.[0-9]+)*' "$file" 2>/dev/null | sed -E 's/^[^p]*//' || true)
  return 0
}

# node references: node@X, "Node X", "Node.js X+", "node-version: X"
check_node() {
  local file="$1" ref v
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    v=$(echo "$ref" | grep -oE '[0-9]+(\.[0-9]+)*')
    version_matches "$v" "$NODE_VER" "$NODE_MAJOR" || report "$file" "$ref" "Node $NODE_VER"
  done < <(grep -oE "(^|[^A-Za-z0-9_/.@-])([Nn]ode(\.js)?[ @]|node-version: *'?\"?)v?[0-9]+(\.[0-9]+)*" "$file" 2>/dev/null | sed -E 's/^[^Nn]*//' || true)
  return 0
}

# typescript version references (only version field, not package names)
check_typescript() {
  local file="$1" ref
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    [ "$ref" != "$TS_VER" ] && report "$file" "typescript $ref" "typescript $TS_VER"
  done < <(grep -oE '"typescript"[":= ]+["\x27]?[\^~]?[0-9]+\.[0-9]+\.[0-9]+' "$file" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)
  return 0
}

# coverage threshold prose: "90% coverage", "90% minimum coverage",
# "coverage below 80%", "coverage drops below 80%", "coverage enforces 80%",
# "coverage threshold of 80%", "coverage must stay at 90%"
COVERAGE_PATTERN='[0-9]+% (minimum )?coverage|[Cc]overage( must stay| drops| is| of)? ?(below|minimum|threshold|at|of|enforces)( of)? [0-9]+%'

check_coverage() {
  local file="$1" ref v
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    v=$(echo "$ref" | grep -oE '[0-9]+%' | tr -d '%')
    [ "$v" != "$COVERAGE_PCT" ] && report "$file" "$ref" "${COVERAGE_PCT}% coverage"
  done < <(grep -oE "$COVERAGE_PATTERN" "$file" 2>/dev/null || true)
  return 0
}

check_docs() {
  local file="$1"
  check_pnpm "$file"
  check_node "$file"
  check_typescript "$file"
  check_coverage "$file"
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

# Files whose version/threshold references must match package.json and
# vitest.config.ts. ADRs under docs/architecture are historical records and
# intentionally excluded, as is this script (its comments quote stale examples).
VERSION_SCAN_FILES=()
for f in README.md CONTRIBUTING.md SECURITY.md AGENTS.md mise.toml package.json docs/*.md .github/*.md; do
  [ -f "$f" ] && VERSION_SCAN_FILES+=("$f")
done
while IFS= read -r f; do
  [ "$f" = "scripts/check-version-drift.sh" ] && continue
  VERSION_SCAN_FILES+=("$f")
done < <(find scripts .github/workflows app \
  -type f \( -name '*.sh' -o -name '*.js' -o -name '*.mjs' -o -name '*.ts' -o -name '*.tsx' -o -name '*.yml' -o -name '*.yaml' \) \
  2>/dev/null | sort)

for f in "${VERSION_SCAN_FILES[@]}"; do
  check_docs "$f"
done

# mise.toml pins tools as `node = "26"` / `pnpm = "12.16.1"`.
if [ -f mise.toml ]; then
  v=$(grep -oE '^node *= *"[^"]+"' mise.toml | grep -oE '[0-9]+(\.[0-9]+)*' || true)
  [ -n "$v" ] && ! version_matches "$v" "$NODE_VER" "$NODE_MAJOR" && report mise.toml "node = \"$v\"" "node = \"$NODE_MAJOR\""
  v=$(grep -oE '^pnpm *= *"[^"]+"' mise.toml | grep -oE '[0-9]+(\.[0-9]+)*' || true)
  [ -n "$v" ] && ! version_matches "$v" "$PNPM_VER" "$PNPM_MAJOR" && report mise.toml "pnpm = \"$v\"" "pnpm = \"$PNPM_VER\""
fi

# GitHub workflows pin pnpm via pnpm/action-setup `version: X.Y.Z`.
for f in .github/workflows/*.yml; do
  [ -f "$f" ] || continue
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    v=$(echo "$ref" | grep -oE '[0-9]+(\.[0-9]+)*')
    version_matches "$v" "$PNPM_VER" "$PNPM_MAJOR" || report "$f" "$ref" "version: $PNPM_VER"
  done < <(grep -A3 -E 'uses: pnpm/action-setup' "$f" | grep -oE "version: *'?\"?[0-9]+(\.[0-9]+)*" || true)
done

# Stale-layout scan: top-level docs plus docs/ (ADRs under docs/architecture
# are historical records and intentionally excluded).
for f in README.md CONTRIBUTING.md SECURITY.md AGENTS.md .github/WORKFLOWS.md docs/*.md; do
  [ -f "$f" ] && check_stale "$f"
done

if [ "$FOUND_DRIFT" -eq 1 ]; then
  die "Drift detected — please align documentation with package.json, vitest.config.ts and the Next.js layout (app/, .next/, pnpm precommit)"
fi

echo "  No version drift detected." >&2
