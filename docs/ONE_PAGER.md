# Cursor for Northstar Financial — Meeting One-Pager

**Audience:** CTO · VP Engineering · VP Developer Experience  
**Decision frame:** Expand Copilot · adopt Cursor · or build on lab APIs

## Thesis

Autocomplete won’t transform a 5,000-engineer SDLC. You need **codebase-aware agents**, **shared organizational context**, and **enterprise-grade controls** from ticket → PR → review. That’s the Cursor platform.

## Where Cursor lands in your stack

```
Jira / Slack / GitHub  →  Cloud Agents + MCP  →  PR + Bugbot  →  CI/CD
                              ↑
                     Cursor IDE (Tab · Inline · Agent)
                              ↑
              Rules · Skills · Team Marketplace · Analytics
```

## Fit to stated goals (fill live)

| Your goal | Cursor capability |
| --- | --- |
| Faster delivery on complex services | Agent + index + multi-file edits + tests |
| Safer AI at scale | Privacy Mode, SSO/SCIM, model/MCP/repo controls, hooks, audit |
| Review capacity | Bugbot on every PR; fix paths into IDE or Cloud Agent |
| Knowledge that scales | Team Rules, AGENTS.md, marketplace skills |
| Prove ROI to Finance | Analytics + AI Code Tracking API + pilot metrics |

## Why not “just Copilot” / “just a lab”?

- **Copilot** optimizes assistance in many IDEs; Cursor optimizes **agentic development** with deep repo context and a cloud execution loop.
- **Labs** sell models; you still need harness, context, integrations, and governance. Cursor is that product — multi-model by design.

## Suggested pilot (4–6 weeks)

1. **3 design-partner teams** (brownfield service + platform + customer-facing)
2. **Security path:** Privacy Mode, SSO, spend limits, MCP allowlist
3. **Success metrics:** cycle time on cross-file tasks, PR rework, engineer preference, review findings caught pre-merge
4. **Enablement:** office hours + codify wins into Team Rules

## Ask

Approve pilot scope + security working session. We’ll return a one-page plan with owners, repos, and metrics.
