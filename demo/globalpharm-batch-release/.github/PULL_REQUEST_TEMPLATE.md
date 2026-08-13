<!-- VALIDATED SYSTEM - change-control evidence required before merge -->

## What & why

<!-- Link the ticket. One or two sentences on the change. -->

Closes: GP-____

## Change-control (GxP)

- [ ] Change is scoped to the validated component named in the ticket
- [ ] Audit trail updated for any new/changed state transition
- [ ] No PHI/PII added to logs
- [ ] `LegacyLimsClient` boundary unchanged (no invented mainframe access)

## Evidence

- [ ] Tests added/updated (happy path + failure + idempotency + audit)
- [ ] Change-board gate passes: `GP_RELEASE_GATE=1 python3 -m unittest discover -s tests`
- [ ] AI-authorship noted (which changes were agent-assisted)

## Reviewers

- Staff eng (code): @
- QA / Validation (evidence): @
- Human who owns the merge gate: @
