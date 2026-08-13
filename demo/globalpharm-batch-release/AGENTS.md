# GlobalPharm batch-release-service — agent notes

**Demo repo.** A GxP-validated batch release service used for the Cursor Field
Eng demo. It is intentionally gnarly.

## Domain in one paragraph

A manufacturing batch moves quarantine -> under_review -> released. Release posts
to a legacy LIMS (mainframe stand-in), generates a label, and MUST leave an
audit trail. Retries must not double-release.

## Conventions

- Python 3.10+, standard library only. Tests via `python3 -m unittest`.
- Keep changes small and reviewable; prefer additive behavior.
- Respect `.cursor/rules/gxp-validated-change.mdc` — those are the controls.

## When implementing GP-4821 (idempotency + audit)

1. Add an idempotency key to `ReleaseRequest` and persist key -> batch result in
   `Store.release_keys`. A repeat call with the same key returns the original
   release and does not call `lims.post_release` again.
2. Record the `released` transition via `audit.record("batch.released", ...)`
   with actor, before/after, and the LIMS ref.
3. Keep the `LegacyLimsClient` boundary. Handle `LIMS-BUSY` as retryable.
4. Arm the gate to verify: `GP_RELEASE_GATE=1 python3 -m unittest discover -s tests`.
