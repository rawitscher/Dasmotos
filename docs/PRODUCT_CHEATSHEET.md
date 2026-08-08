# Cursor Product Cheat Sheet (FE)

Quick facts for discovery + demo. Prefer [cursor.com/docs](https://cursor.com/docs) if anything conflicts.

## One-liner

Cursor is an AI-native development environment (VS Code fork) plus agent platform: Tab, Inline Edit, Agent, Cloud Agents, Bugbot, Rules/Skills/MCP, and enterprise governance — so models operate *inside* the SDLC.

## Core surfaces

| Surface | Shortcut / where | What to say |
| --- | --- | --- |
| **Tab** | Tab / Esc | Next-action autocomplete; multi-line; jump-in-file; cross-file portals |
| **Inline Edit** | Cmd/Ctrl+K | Surgical edit with instruction in-place |
| **Agent** | Cmd/Ctrl+I (sidepane) | Plan/search/edit/terminal/browser; checkpoints; queue |
| **Plan / Ask / Debug / Agent modes** | mode picker | Match mode to risk: explore vs change vs diagnose |
| **Cloud Agents** | cursor.com/agents, Slack, GH comment `@cursor` | Parallel VM agents; PRs + artifacts; multi-repo |
| **Bugbot** | PR checks / `cursor review` | Agentic PR review; Fix in Cursor / Fix in Web |
| **Rules** | `.cursor/rules`, AGENTS.md, Team Rules | Persistent org/project instructions |
| **Skills / Hooks / Subagents** | Customize / `.cursor` | Package workflows; policy on tool use |
| **MCP** | `.cursor/mcp.json`, marketplace | Tools into Jira, DBs, internal APIs — allowlisted |
| **CLI** | `cursor-agent` / headless | CI and terminal-native agenting; JetBrains ACP story |

## Context system

- Codebase indexing for large repos / monorepos
- `@` files, folders, docs, rules, web
- Rules: Always / Intelligent / Glob / Manual
- Nested `AGENTS.md`
- Memories (user-level preferences — don’t oversell vs Rules for enterprises)

## Enterprise control plane

- **Privacy Mode** org-wide — no training by Cursor or providers (ZDR agreements)
- **SSO** SAML/OIDC; **SCIM** (Enterprise)
- Model / MCP / repository controls
- Auto-run, browser, network controls; agent sandbox
- Hooks (MDM + server-side distribution on Enterprise)
- Audit logs, service accounts, billing groups, pooled usage
- Analytics, Conversation Insights, **AI Code Tracking API**, **Cursor Blame**
- OpenTelemetry export; HIPAA BAA (Enterprise, request path)
- **Not today:** full on-prem IDE — be honest; private connectivity for source control exists for Cloud Agents

## Pricing (list — Enterprise is custom)

| Plan | List | Memorable inclusions |
| --- | --- | --- |
| Hobby | Free | Limited Agent, Composer |
| Pro | ~$20/user/mo | Agent limits, frontier models, MCP/skills/hooks, Cloud Agents, Bugbot usage-based |
| Teams | ~$40/user/mo | Admin, team marketplace, Bugbot, shared cloud context, analytics, Privacy Mode, SSO |
| Enterprise | Custom | Pooled usage, SCIM, repo/model/MCP controls, audit, AI code tracking, priority support |

## Integrations that matter in enterprise disco

GitHub / GHES · GitLab · Bitbucket · Azure DevOps · Slack · Teams · Jira · Linear · Notion · JetBrains (ACP) · Xcode

## Proof points (public marketing — use as color, not contracts)

- 64% of Fortune 500 using Cursor (cursor.com/enterprise)
- Strong engineer preference in head-to-head evals (cite as directional)
- Named logos/stories: Stripe, NVIDIA, Coinbase, Rippling, Salesforce, PayPal, Faire (Cloud Agents), etc.

## Keyboard muscle memory

- Agent: `Cmd/Ctrl+I`
- Inline Edit: `Cmd/Ctrl+K`
- Command Palette: `Cmd/Ctrl+Shift+P`
- Accept Tab: `Tab` · partial: `Cmd/Ctrl+→`
- Queue vs interrupt Agent: `Enter` vs `Cmd/Ctrl+Enter`

## Docs to bookmark before the meeting

- https://cursor.com/docs/agent/overview.md
- https://cursor.com/docs/cloud-agent.md
- https://cursor.com/docs/bugbot.md
- https://cursor.com/docs/rules.md
- https://cursor.com/docs/mcp.md
- https://cursor.com/docs/enterprise.md
- https://cursor.com/security · https://trust.cursor.com
- https://cursor.com/pricing
