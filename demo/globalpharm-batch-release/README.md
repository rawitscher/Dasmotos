# GlobalPharm — Batch Release & Labeling (demo)

A deliberately gnarly, GxP-**validated** service for the Cursor Field Eng demo. This is the "ugly 15-year-old service your engineers wake up to on Monday" — not a scaffold.

## Domain

GlobalPharm manufactures drug product in batches. Before a batch ships, it must be **released**: quality checks pass, the batch is posted to the legacy **LIMS** (Laboratory Information Management System — a mainframe stand-in), and a label is generated. Every state change in a validated system must leave an **audit trail** (GxP / 21 CFR Part 11 / ITGC evidence).

## Why it's realistic (the mess is the point)

- `BatchReleaseService` is a **god class**: validation + LIMS posting + labeling + audit all tangled together.
- `LegacyLimsClient` simulates a **flaky mainframe** with latency and duplicate-post risk.
- **No idempotency** on release — a client retry can double-release a batch (the money bug).
- Inconsistent error shapes between modules; thin tests on the path you touch.
- The audit trail is **partial** — some state changes aren't recorded (a validated-system finding waiting to happen).

## Run

```bash
cd demo/globalpharm-batch-release
python3 -m unittest discover -s tests -v
```

No dependencies. Python 3.10+ stdlib only.

## The demo ticket

See [`TICKETS/GP-4821.md`](TICKETS/GP-4821.md) — "Make batch release idempotent + complete the audit trail." This is what you drive through the 8-station spine.

## Staged imperfection (read the demo script)

- The agent's first plan will likely miss the **audit-trail requirement** encoded in `.cursor/rules` — let it, then correct it. That is the human-in-the-loop beat.
- `tests/test_release_gate.py` contains a **deliberately failing** gate (`RELEASE_GATE_ARMED`) you triage live to show the merge gate firing while the human holds the key.

## Intentional gaps (for the demo, not bugs to "fix" quietly)

- No idempotency key on `release_batch`
- `LegacyLimsClient` double-posts on retry and flakes ~1 in 12 calls
- `audit.py` is only called on some paths
- `labeling.py` trusts unvalidated input (mild)
