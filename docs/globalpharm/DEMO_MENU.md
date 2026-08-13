# Demo menu — flex by discovery

You have one deep run (the spine) plus lightweight modules. Pick based on the pain they rank #1. Depth over coverage — show two or three things that map to real money, not everything.

| If discovery surfaces… | Pull this | Where | Control to name |
|---|---|---|---|
| "Validated changes wait weeks in evidence" | Full **8-station spine** on GP-4821 | `demo/globalpharm-batch-release` + [DEMO_SCRIPT](DEMO_SCRIPT.md) | ITGC evidence, human holds merge key |
| "Nobody understands the legacy service" | **explain-legacy** skill (Ask-mode, read-only) | repo `.cursor/skills/explain-legacy` | Read-only blast-radius review |
| "AI writes garbage here" | **Rules ON vs OFF** run | repo `.cursor/rules` | Policy-as-config |
| "How do we prove it to audit?" | **gxp-change-summary** skill on the diff | repo `.cursor/skills/gxp-change-summary` | ITGC evidence, AI-authorship |
| "Our seniors don't trust it" | **devils-advocate** subagent on the plan | `.cursor/agents/devils-advocate.md` | Separation of duties |
| "Review is the bottleneck" | **Bugbot** on the PR (advises, human approves) | live (if connected) | Automated review, human approval |
| "What does this look like at scale?" | **Slack cloud-agent** beat + drag-to-trigger story | [SLACK_DEMO](SLACK_DEMO.md) | Foreground/background rule |
| "We have COBOL/SAS too" | **SAS → Python/R migration** narration | verbal (DEMO_SCRIPT flourish) | Numeric-equivalence oracle |

## Lightweight combos (5–8 min each)

- **Onboarding win:** explain-legacy → name blast-radius. Great when a senior fears the legacy monolith.
- **Trust win:** Plan (gap-catch) → devils-advocate → name separation of duties. Great with skeptical seniors.
- **Audit win:** small change under rules → gxp-change-summary → name ITGC evidence. Great with compliance in the room.
- **Scale win:** Slack ticket handoff → cloud agent → PR + artifacts. Great when the CTO asks about org-wide rollout.

## Cutting for time

If you're 5 minutes behind, cut into Act 2 (the change), never Act 3 (tests → PR → gate). The gate firing with a human holding the key is the non-negotiable close.
