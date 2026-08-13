---
name: gxp-change-summary
description: >-
  Generate a GxP change-control / ITGC evidence summary for a code change in a
  validated system. Use before opening a PR on batch-release-service, or when
  the user asks for a change-control note, validation summary, or audit
  evidence for a diff.
---

# GxP change summary

Produce the change-control evidence a validated-system reviewer and auditor
need. This turns a raw diff into a defensible artifact.

## When to use

- Before opening a PR that touches a validated component.
- When asked for "change-control note", "validation summary", "Part 11 /
  ITGC evidence", or "what changed and why" for a diff.

## Steps

1. Read the diff (staged changes, or the range the user names). Do not change code.
2. Identify the validated components and state transitions affected.
3. Produce the summary in the format below. Keep it tight and factual.

## Output format

```
## Change-control summary

Ticket: <id>
Validated component(s): <files/modules>
Author(s): <human> (AI-assisted: yes/no + which parts)

### What changed
- <bullet per meaningful change, plain language>

### State transitions affected
- <transition>: audit entry added/updated? (yes/no)

### Controls exercised
- Idempotency: <how retries are made safe>
- Audit trail: <what is now recorded>
- Legacy boundary: <confirmed unchanged / details>
- Data handling: <PHI/PII considerations>

### Evidence
- Tests: <names of added/updated tests + what they pin>
- Gate: <command + result, e.g. GP_RELEASE_GATE=1 ... PASS>

### Residual risk / follow-ups
- <anything deferred, with a reason>
```

## Rules

- Do not overstate. If something wasn't tested, say so under residual risk.
- Never include PHI/PII or full payloads in the summary.
- If AI wrote part of the change, state which part (AI-authorship tracking).
