#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Local CI Simulation Script
# Purpose: Run the same gates as CI locally before pushing
# Usage: ./scripts/ci-local.sh [--fast] [--no-security]
#
# The gate list is defined once in package.json (check:static, check:deps,
# test:coverage) and shared by `pnpm precommit` and the CI workflows. This
# script runs those same named scripts, then adds the CI-only steps that need
# a build or external tools (bundle size, OSV scan, container scan).
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FAST_MODE=false
SKIP_SECURITY=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[CI-LOCAL]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fast)
            FAST_MODE=true
            shift
            ;;
        --no-security)
            SKIP_SECURITY=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--fast] [--no-security]"
            echo "  --fast        Skip slower checks (container scan, full coverage)"
            echo "  --no-security Skip security scans"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

cd "$PROJECT_ROOT"

log "Starting local CI simulation..."
if [ "$FAST_MODE" = true ]; then
    info "Running in fast mode (some checks skipped)"
fi

# 1. Install dependencies (like CI setup)
log "Installing dependencies..."
pnpm install --frozen-lockfile

# 2. Security audit (CI: reusable-security.yml → audit job)
log "Running security audit..."
pnpm audit --audit-level critical

# 3. Static gates (CI: reusable-validate.yml → lint job)
#    format, spelling, YAML, Markdown and workflow linting, version drift,
#    typecheck, ESLint — identical list to `pnpm precommit`
log "Running static checks (pnpm check:static)..."
pnpm check:static

# 4. Dependency and structure gates (CI: reusable-validate.yml → code-quality job)
#    circular deps, dependency-cruiser rules, duplication, dead code
log "Running dependency and structure checks (pnpm check:deps)..."
pnpm check:deps

# 5. Tests (CI: reusable-validate.yml → test job)
log "Running tests..."
if [ "$FAST_MODE" = true ]; then
    info "Fast mode: running tests without the coverage threshold"
    pnpm test
else
    pnpm test:coverage
fi

# 6. Build and bundle size (CI: reusable-validate.yml → code-quality job)
log "Building and checking bundle size..."
pnpm build
pnpm size

# 7. Security scans (CI: reusable-security.yml + docker workflow)
if [ "$SKIP_SECURITY" = false ]; then
    log "Running security scans..."

    # Secret scan (CI: secrets job)
    if command -v gitleaks &> /dev/null; then
        echo "  → Secret scan..."
        pnpm scan:secrets
    else
        warn "gitleaks not installed (brew install gitleaks). Skipping secret scan; CI will run it."
    fi

    # OSV dependency scan (CI: osv-scan job)
    if command -v osv-scanner &> /dev/null; then
        echo "  → OSV vulnerability scan..."
        if [ -r pnpm-lock.yaml ]; then
            osv-scanner --lockfile=pnpm-lock.yaml
        else
            warn "pnpm-lock.yaml not found or not readable. Skipping OSV scan."
        fi
    else
        warn "OSV scanner not installed. Run: go install github.com/google/osv-scanner/cmd/osv-scanner@latest"
    fi

    # Container scan (CI: docker job, only when ENABLE_DOCKER_RELEASE is set)
    if [ "$FAST_MODE" = false ] && [ -f "./scripts/scan-container.sh" ]; then
        if command -v docker &> /dev/null && command -v trivy &> /dev/null; then
            echo "  → Container security scan..."
            ./scripts/scan-container.sh
        else
            warn "Docker or Trivy not available. Skipping container scan."
        fi
    fi
else
    info "Security scans skipped"
fi

# 8. Changeset validation (CI: lint job on pull requests)
log "Checking changesets..."
if pnpm changeset:status > /dev/null 2>&1; then
    info "Changesets validated"
else
    warn "Changeset check failed: run 'pnpm changeset' (or 'pnpm changeset --empty' for non-release changes)"
fi

# 9. Final summary
log "✅ Local CI simulation complete!"
echo
info "Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Security audit passed"
echo "  ✅ Static checks passed (check:static)"
echo "  ✅ Dependency and structure checks passed (check:deps)"
echo "  ✅ Tests passed"
echo "  ✅ Build and bundle size passed"
if [ "$SKIP_SECURITY" = false ]; then
    echo "  ✅ Security scans completed (see warnings above for skipped tools)"
fi
echo
info "Your code is ready to push! 🚀"
echo
info "Next steps:"
echo "  1. git add . && git commit -m 'your commit message'"
echo "  2. git push origin your-branch"
echo "  3. Create a pull request"
