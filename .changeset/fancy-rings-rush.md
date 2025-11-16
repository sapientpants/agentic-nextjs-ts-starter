---
---

Disabled GitHub release workflow for Next.js starter template.

This is a starter template meant to be cloned/forked, not distributed as a package.
The main.yml workflow now skips the build, npm packaging, docker, and release creation
jobs. Validation and security scanning continue to run on every push to main.

To re-enable releases: Remove `if: false` condition from the build job in main.yml.
