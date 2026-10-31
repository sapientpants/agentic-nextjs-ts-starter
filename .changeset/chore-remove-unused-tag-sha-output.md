---
---

chore(ci): remove the unused `tag_sha` plumbing from the release workflows

- Drop the `tag_sha` output from the `build` job in `main.yml`; its only consumer was the `dist/` tarball packaging step removed in #67
- Stop writing the tag SHA to `$GITHUB_OUTPUT` and logging "Tag SHA for artifacts" in the "Create and push tag" step (tag creation is unchanged)
- Remove the `tag_sha` input from `reusable-docker.yml`; both callers resolved it to `github.sha` anyway, so artifact names now use `github.sha` directly
- Closes #68
