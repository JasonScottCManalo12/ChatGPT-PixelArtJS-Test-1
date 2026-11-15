# Pull Request Workflow

## Status and scope

This document defines the standard integration workflow for PixelArtJS development in this repository. Version branches remain independent; a pull request is the required review boundary before changes enter a destination branch.

## Branch model

- `main`: approved release integration only.
- `pixelartjs-new-ui-v1`: Version 1 development and integration.
- `pixelartjs-new-ui-v2`: Version 2 development and integration.
- `pixelartjs-new-ui-v3`: Version 3 development and integration.
- Task-specific feature branches: isolated work for a defined change.

Keep V1, V2, and V3 separate. Do not merge one version branch into another merely to synchronize histories or combine features.

## Standard workflow

1. Start from the intended destination version branch.
2. Create a task-specific feature branch.
3. Make a focused change limited to the task's scope.
4. Run relevant checks and record their actual outcomes.
5. Open a pull request from the feature branch into its matching version branch.
6. Review the PR description, changed files, implementation, test evidence, and risks.
7. Address requested changes and update the PR.
8. Merge only after the change is accepted.
9. Keep or remove the source branch according to an explicit branch-retention decision; do not delete branches automatically.

## Version routing

| Work area | PR destination |
|---|---|
| Version 1 work | `pixelartjs-new-ui-v1` |
| Version 2 work | `pixelartjs-new-ui-v2` |
| Version 3 work | `pixelartjs-new-ui-v3` |
| Approved release of a version | `main` |

A PR targeting `main` is a release-integration PR, not a routine development PR. It requires explicit release approval. Do not merge V1, V2, or V3 into `main` automatically.

## Required pull request description

Every PR should state:

1. **Purpose** — the problem or objective.
2. **Scope** — the version and components affected, plus explicit exclusions.
3. **Changes** — the meaningful implementation and documentation changes.
4. **Verification** — commands, tests, environments, and observed results. Distinguish source inspection, syntax checks, and functional/browser tests. Mark unrun checks as pending; do not claim a pass without evidence.
5. **Risks** — compatibility concerns, regressions, limitations, and follow-up work.
6. **Acceptance** — the criteria used to decide whether the change is ready.

## Review and merge policy

- Confirm the PR targets the correct version branch.
- Check that changes remain within the stated scope.
- Inspect the full diff, including generated or moved files.
- Verify that test claims match available evidence.
- Resolve review comments and conflicts before merging.
- Prefer a merge commit to preserve branch history, unless a different merge method is explicitly chosen for a justified reason.
- Do not merge a PR merely because it is technically mergeable.
- Do not merge to `main`, release a version, or perform destructive branch cleanup without explicit user approval.

## Version release process

When a version is ready for release:

1. Complete that version's acceptance checklist and functional verification.
2. Prepare a release PR from the version branch to `main`.
3. Summarize the version scope, known limitations, and verification evidence.
4. Review and obtain explicit release approval.
5. Merge the release PR using the agreed merge method.

## Reporting status

Report these separately:

- branch/file export or preservation;
- branch-history integration;
- syntax/static checks;
- functional/browser verification;
- PR review and merge status;
- release status.

A branch being ahead of another branch, or a PR being mergeable, does not prove that the application works correctly.
