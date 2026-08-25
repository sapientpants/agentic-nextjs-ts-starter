# ADR-0010: Replace Claude Code with OpenCode and Local Models

**Status:** Accepted
**Date:** 2025-08-15
**Supersedes:** Use of Claude Code as primary AI assistant

## Context

This project previously relied on Claude Code (Anthropic's CLI-based AI assistant) as the primary AI pair programming tool. This decision document records the rationale for replacing it with OpenCode and locally-run models.

The key concerns driving this change:

- **Vendor lock-in** — Reliance on a single vendor's API, pricing, and availability
- **Cost predictability** — API usage costs scale with complexity and can be unpredictable
- **Privacy** — Sending proprietary code to external servers introduces data exposure risk
- **Offline capability** — API-dependent tools require constant internet connectivity
- **Customization** — Limited ability to modify model behavior or swap underlying models
- **Censorship and guardrails** — External models may refuse valid development tasks based on vendor policy

## Decision

We replace Claude Code with **OpenCode** as the CLI AI assistant, backed by **locally-run models** via the `mlxlocal/mlx-community/Qwen3.6-35B-A3B-4bit` model (or equivalent).

### What this means

1. **OpenCode** becomes the primary AI coding assistant for this project, configured through `.opencode/` rather than `.claude/`.
2. **Local models** run inference on hardware, eliminating API calls for code generation.
3. **AGENTS.md** is updated to reference OpenCode workflows instead of Claude Code commands.
4. **`.claude/commands/`** directory is migrated to OpenCode's equivalent command system.
5. Git hooks, CI/CD, and development workflows remain unchanged — only the AI tooling layer shifts.

### What this does not mean

- The project's TypeScript code, testing strategy, or architecture is unaffected.
- External APIs (e.g., for runtime operations) continue to function as before.
- Human code review and responsibility remain unchanged.

## Consequences

### Positive

- **Full data privacy** — Code never leaves the development machine.
- **Zero marginal cost** — No per-token or per-request charges after hardware investment.
- **Offline operation** — AI assistance works without internet connectivity.
- **Model flexibility** — Swap or fine-tune models without vendor constraints.
- **Uncensored assistance** — No external policy restrictions on valid development tasks.
- **Auditability** — Local models can be inspected, versioned, and pinned.

### Negative

- **Hardware requirements** — Requires sufficient RAM and GPU/CPU for local inference (35B parameter model at 4-bit quantization requires ~20GB RAM).
- **Slower inference** — Local models are generally slower than cloud API responses, especially for complex queries.
- **Reduced capability** — A 35B model at 4-bit quantization will not match the capability of frontier proprietary models on complex reasoning tasks.
- **Setup complexity** — Developers must configure local inference tooling rather than having a ready-to-use API.
- **Migration effort** — Existing `.claude/` commands and configurations must be ported to OpenCode's format.

### Neutral

- **CI/CD unaffected** — Automated pipelines do not use AI assistants.
- **Code quality unchanged** — Linting, testing, and type checking remain the same.
- **Team onboarding** — New developers will need training on OpenCode instead of Claude Code.

## References

- [OpenCode documentation](https://opencode.ai)
- [MLX Community models](https://huggingface.co/mlx-community)
- AGENTS.md — Development workflow documentation
