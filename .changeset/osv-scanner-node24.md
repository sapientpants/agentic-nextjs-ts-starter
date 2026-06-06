---
---

chore(ci): bump google/osv-scanner-action to v2.3.8

The previous v2.2.1 reusable workflow internally pinned Node 20 actions
(checkout, upload-artifact, codeql-action/upload-sarif), which produced the
last remaining Node.js 20 deprecation warning in CI. v2.3.8 pins Node 24
equivalents, clearing the warning.
