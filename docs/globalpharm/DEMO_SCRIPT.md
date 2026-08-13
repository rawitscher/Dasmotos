# GlobalPharm — Demo Script (0:25–0:42)

**The claim your demo proves, in one sentence:** *the AI moved fast AND the change stayed inside your controls.*
Aim to look **boring in the most reassuring way** — reviewable, governed, evidenced.

**Repo:** [`demo/globalpharm-batch-release`](../../demo/globalpharm-batch-release) — a GxP-validated batch release service. Gnarly on purpose (god class, flaky LIMS, no idempotency, partial audit trail). **Ticket:** `TICKETS/GP-4821.md`.

**Macro frame:** tell → show → tell. **Micro arc (every station):** pain → workflow → guardrail → metric → **name the control**.

---

## Pre-flight (before the room)

- Open the repo in Cursor; let indexing finish. Privacy Mode on (say it out loud).
- Terminal ready: `cd demo/globalpharm-batch-release`.
- Confirm baseline: `python3 -m unittest discover -s tests -v` → 2 pass, 2 skipped.
- Have the gate command ready: `GP_RELEASE_GATE=1 python3 -m unittest discover -s tests -v` (fails until fixed).
- Second screen = these notes. Notifications off. Clean profile.

**Tell (before touching the keyboard):**
> "I'm going to take a real regulatory ticket into a reviewable PR on a validated service, and the whole time the agent is fenced by your rules and a human owns the merge. Watch for the controls, not the typing."

---

## The 8-station spine

| # | Station | Persona it lands on | Control you NAME |
|---|---|---|---|
| 1 | Ticket intake (GP-4821) | PM / delivery lead | Value-stream traceability |
| 2 | Ask-mode explore | Senior / staff eng | Read-only blast-radius review |
| 3 | Reviewable Plan (catches a gap) | Staff eng | Separation of duties |
| 4 | Change under Project Rules | Architect / security | Policy-as-config guardrail |
| 5 | Meaningful tests | QA / validation | Quality gate |
| 6 | Diff → PR + evidence | Auditor / compliance | ITGC evidence, AI-authorship |
| 7 | Bugbot advises | Security / eng lead | Automated review, human approval |
| 8 | Failing CI triage | Release mgr / auditor | Merge gate — human holds the key |

```mermaid
flowchart LR
  t["1 Ticket GP-4821"] --> e["2 Ask explore"] --> p["3 Plan (gap-catch)"] --> c["4 Change under rules"] --> te["5 Tests"] --> pr["6 PR + evidence"] --> r["7 Bugbot"] --> g["8 Gate: human holds key"]
```

---

## Station-by-station

### 1 · Ticket intake
Pull `GP-4821` into context (paste it, or `@TICKETS/GP-4821.md`).
- **Pain:** "A regulatory finding: releases can double-post to LIMS on retry, and the release isn't in the audit trail."
- **Name the control:** *value-stream traceability — work starts from intake, not a blank prompt.*

### 2 · Ask-mode explore (the onboarding beat — wins the senior)
Switch to **Ask mode** (read-only) or run the `explain-legacy` skill:
> "Explain this service and map the release flow. Where does state change, and what's the blast radius of changing release? Use a diagram."
- Let it surface the god class + the LIMS boundary + the untested release path.
- **Name the control:** *read-only blast-radius review — nothing changed; we understood before touching.*

### 3 · Reviewable Plan (stage the gap-catch)
Switch to **Plan mode**:
> "Plan the fix for GP-4821: make release idempotent and complete the audit trail. Follow the project rules."
- **Staged imperfection:** the first plan will likely focus on idempotency and **miss the audit-trail requirement** (or the LIMS-BUSY retry). Don't rescue instantly.
- Correct it like an engineer: *"the rules require an audit entry on every transition — add that to the plan."* Watch it adapt.
- **Name the control:** *separation of duties — intent is reviewed and corrected before a line of code is written.*

### 4 · Change under Project Rules
Approve the plan; let it implement against `.cursor/rules/gxp-validated-change.mdc`.
- Expected shape: idempotency key on `ReleaseRequest`, `Store.release_keys` reused on retry (no second LIMS post), `audit.record("batch.released", ...)` added, `LegacyLimsClient` boundary untouched.
- **Optional rules ON vs OFF beat:** if they doubt governance, run the same ask with rules disabled and show the sloppier result.
- **Name the control:** *policy-as-config — the guardrail is versioned in the repo, not in someone's head.*

### 5 · Meaningful tests
Have it add tests: happy path, retry/idempotency, LIMS-BUSY, audit entry.
- **Name the control:** *quality gate — a test that pins the behavior, not snapshot fluff.*

### 6 · Diff → PR with evidence
Open the diff; open a PR using `.github/PULL_REQUEST_TEMPLATE.md`. Run the `gxp-change-summary` skill to generate the change-control note.
- **Name the control:** *ITGC evidence + AI-authorship tracking — the PR is the evidence package your auditor needs.*

### 7 · Bugbot advises
(If Bugbot is connected on the demo repo) let it review; be explicit: **Bugbot advises, humans approve. It never merges.**
- **Name the control:** *automated review with human approval.*
- Optional: run the **devils-advocate** subagent on the plan/diff for a second, skeptical pass.

### 8 · Triage the failing gate (the money beat)
Arm the change-board gate:
```bash
GP_RELEASE_GATE=1 python3 -m unittest discover -s tests -v
```
- If you fixed it live, it now **passes**. If you want the gate-fires beat, run it *before* the fix so the room sees it red, then fix and re-run green.
- **Name the control:** *the merge gate fired and a human holds the key — the AI accelerated the work, it never controlled the gate.*

**Tell (close the loop):**
> "So what just happened: a regulatory ticket became a reviewed PR with tests, an audit trail, and a change-control summary — and at no point did the agent step outside your rules or own the merge. That's governed velocity."

---

## Reference: what "done" looks like (for your own prep only — don't paste)

- `ReleaseRequest` gains `idempotency_key`.
- `release_batch` checks `store.release_keys[key]`; if present, returns the existing released batch without calling `lims.post_release`.
- On success, store `key -> batch.id` and call `audit.record("batch.released", batch_id, actor=req.released_by, before="under_review", after="released", lims_ref=...)`.
- LIMS-BUSY handled as retryable (caller may retry with same key safely).
- Gate: `GP_RELEASE_GATE=1 ...` → all pass.

## The "at scale" flourish (verbal, if they ask)
The SAS → Python/R migration story: Act 1 is the dependency graph nobody has; Act 2 is **parallel cloud agents** migrating leaf-first (the wall turning green is the money shot); Act 3 is **numeric equivalence as the oracle** — the PR only opens when outputs match. *"This is double-programming your biostats org already does by hand; I'm automating one side of a QC process that already exists."* Name the **foreground/background rule**: verifiable-by-artifact → push async to a cloud agent; ambiguous/security-sensitive → keep foreground.

## If it breaks
> "I don't know that off the top of my head — I'll verify and follow up." A calm recovery inside the guardrails is the demo. Cut into Act 2 if you're behind; never sacrifice Act 3 (the gate).
