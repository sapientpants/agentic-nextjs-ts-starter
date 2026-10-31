#!/usr/bin/env bash
#
# Secret scanning with gitleaks
# Scans git history and current files for secrets and credentials.
# Used locally (`pnpm scan:secrets*`) and by the `secrets` job in
# .github/workflows/reusable-security.yml, so both run the same command.
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gitleaks is installed
if ! command -v gitleaks &> /dev/null; then
  echo -e "${RED}Error: gitleaks is not installed${NC}"
  echo ""
  echo "Install gitleaks:"
  echo "  macOS:   brew install gitleaks"
  echo "  Linux:   See https://github.com/gitleaks/gitleaks#installation"
  echo "  Docker:  docker pull zricethezav/gitleaks"
  echo ""
  echo "In CI a pinned release is installed by .github/workflows/reusable-security.yml"
  exit 1
fi

# .gitleaks.toml uses the [[allowlists]] syntax introduced in gitleaks 8.25.
# Older releases silently ignore that key, so every allowlisted finding would
# be reported as a leak. Fail early with a clear message instead.
MIN_GITLEAKS_VERSION="8.25.0"
INSTALLED_GITLEAKS_VERSION="$(gitleaks version 2>/dev/null | tr -d 'v' | head -n1)"
if [ -z "$INSTALLED_GITLEAKS_VERSION" ] || \
   [ "$(printf '%s\n' "$MIN_GITLEAKS_VERSION" "$INSTALLED_GITLEAKS_VERSION" | sort -V | head -n1)" != "$MIN_GITLEAKS_VERSION" ]; then
  echo -e "${RED}Error: gitleaks >= ${MIN_GITLEAKS_VERSION} is required (found: ${INSTALLED_GITLEAKS_VERSION:-unknown})${NC}"
  echo "The project's .gitleaks.toml uses the [[allowlists]] syntax from 8.25+. Upgrade gitleaks (brew upgrade gitleaks)."
  exit 1
fi

# gitleaks parses `git log -p` output. A user-level `color.ui = always` (or any
# forced diff coloring) injects ANSI escapes into that stream and gitleaks then
# silently scans 0 commits. These env entries override every git config file
# for the gitleaks process only (git >= 2.31).
export GIT_CONFIG_COUNT=2
export GIT_CONFIG_KEY_0=color.ui
export GIT_CONFIG_VALUE_0=never
export GIT_CONFIG_KEY_1=color.diff
export GIT_CONFIG_VALUE_1=never

# Common flags: project config, redact secret values in logs, print findings.
COMMON=(--config .gitleaks.toml --redact --verbose)

# Run a gitleaks git scan and refuse to report success if nothing was scanned.
# gitleaks exits 0 with "0 commits scanned" when it cannot parse the log, which
# would turn the gate into a no-op.
run_git_scan() {
  local output status
  set +e
  output=$(gitleaks git "${COMMON[@]}" "$@" . 2>&1)
  status=$?
  set -e
  echo "$output"
  if [ "$status" -ne 0 ]; then
    return "$status"
  fi
  # Match "0 commits scanned" only as a whole number: gitleaks wraps the count
  # in ANSI bold, and a plain substring test would also match 10, 20, 100, ...
  if echo "$output" | grep -qE '(^|[^0-9])0 commits scanned' && [ "$(git rev-list --count HEAD)" -gt 0 ]; then
    echo -e "${RED}Error: gitleaks scanned 0 commits in a repository with history${NC}"
    echo "The git log could not be parsed. Check for git config that alters 'git log -p' output."
    return 1
  fi
}

# Default mode is to scan
MODE="${1:-scan}"

case "$MODE" in
  scan)
    echo -e "${GREEN}Scanning repository history for secrets...${NC}"
    run_git_scan
    ;;
  protect)
    echo -e "${GREEN}Scanning staged changes for secrets...${NC}"
    gitleaks git "${COMMON[@]}" --pre-commit --staged .
    ;;
  history)
    echo -e "${YELLOW}Scanning full git history (all refs) for secrets...${NC}"
    echo -e "${YELLOW}This may take a while for large repositories${NC}"
    run_git_scan --log-opts="--all"
    ;;
  report)
    echo -e "${GREEN}Generating secret scan report...${NC}"
    mkdir -p reports
    run_git_scan --report-format json --report-path reports/gitleaks-report.json
    echo -e "${GREEN}Report saved to reports/gitleaks-report.json${NC}"
    ;;
  *)
    echo "Usage: $0 {scan|protect|history|report}"
    echo ""
    echo "Modes:"
    echo "  scan     - Scan repository history (default; what CI runs)"
    echo "  protect  - Scan staged changes only (pre-commit)"
    echo "  history  - Scan all refs, not just the current branch"
    echo "  report   - Generate JSON report"
    exit 1
    ;;
esac

echo -e "${GREEN}✓ Secret scan complete${NC}"
