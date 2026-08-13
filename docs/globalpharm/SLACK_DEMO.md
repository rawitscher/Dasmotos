# Slack as a live demo surface

The "surfaces across your lifecycle" beat: show that work can start where engineers already live — Slack — and come back as a reviewed PR with artifacts.

## Rehearsal backdrop (already seeded)

Channel: **#globalpharm-fe-demo** (`C0BPMV0H0GP`) in the demo Slack org.

It's pre-seeded with a staged flow you can screen-share:
1. A ticket handoff: `@Cursor take GP-4821 …` with a blast-radius/allowlist note.
2. A threaded "cloud agent" progression: started → Ask-mode explore → **plan gap-catch** → PR opened with evidence → awaiting human merge.
3. A **champion-forward recap** listing the named controls (the message they forward to their risk committee).
4. The **board-column pattern** ("In Progress · Cursor") + the foreground/background rule.

These are **props authored for rehearsal**, not a live integration. Say that if asked — honesty is the trust move.

## The real flow (what actually happens in prod)

1. Admin installs the **Cursor Slack app** and connects source control (GitHub/GitLab/Bitbucket/Azure DevOps).
2. In a channel, an engineer types `@Cursor <task>` (or drags a Jira ticket into an "In Progress · Cursor" column wired by webhook).
3. A **Cloud Agent** spins up in an isolated VM, clones the repo, works on a branch, runs tests, and opens a PR.
4. It posts progress back to the thread and attaches **artifacts** (diff, test results, screenshots/video).
5. **Bugbot** reviews the PR; **a human approves and merges.** The agent never holds the merge key.

## How to run it live in the meeting

- If the org has the Cursor Slack app: do it for real on the demo repo — trigger from Slack, switch to the PR.
- If not: screen-share **#globalpharm-fe-demo**, walk the thread top-to-bottom, and narrate each control. Then switch to Cursor and run the actual 8-station spine on the repo so the Slack thread and the live run match.

## Controls to name while on this surface

- **Repo allowlist / blast radius** — the agent is fenced to `batch-release-service`.
- **Separation of duties** — plan approved before code; human owns the merge.
- **Foreground/background rule** — async only when the result is verifiable by artifact.
- **Audit trail** — the Slack thread + PR is itself a record of who asked for what, when.

## Reset / re-seed

To re-run prep and refresh the props, re-post the sequence in
`docs/globalpharm/SLACK_DEMO.md` order to `C0BPMV0H0GP` (or a fresh channel). Keep the disclaimer message first.
