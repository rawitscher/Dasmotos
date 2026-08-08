# Cursor Product Cheat Sheet (FE)

Quick facts for discovery + demo. Prefer [cursor.com/docs](https://cursor.com/docs) if anything conflicts.

## One-liner

Cursor is an AI-native development environment (VS Code fork) plus agent platform: Tab, Inline Edit, Agent, Cloud Agents, Bugbot, Rules/Skills/MCP, and enterprise governance — so models operate *inside* the SDLC.

## Core surfaces

| Surface | Shortcut / where | What to say |
| --- | --- | --- |
| **Tab** | Tab / Esc | Next-action autocomplete; multi-line; jump-in-file; cross-file portals |
| **Inline Edit** | Cmd/Ctrl+K | Surgical edit in-place (User Rules do **not** apply here) |
| **Agent** | Cmd/Ctrl+I or L | Search/edit/terminal/browser; checkpoints; queue |
| **Modes** | Shift+Tab or picker | **Agent** (edits) · **Ask** (read-only) · **Plan** (approve then build) · **Debug** |
| **Cloud Agents** | cursor.com/agents, Slack, GH/Bitbucket `@cursor`, Linear/Jira | Parallel VMs; PRs + artifacts; multi-repo *(formerly “Background Agents”)* |
| **Bugbot** | PR checks / `cursor review` | Agentic PR review; Autofix → Cloud Agent; `.cursor/BUGBOT.md` |
| **Rules** | `.cursor/rules`, AGENTS.md, Team Rules | Persistent org/project instructions (Team → Project → User) |
| **Skills / Hooks / Subagents** | Customize / `.cursor` | Packaged workflows; observe/block agent loop |
| **MCP** | `.cursor/mcp.json`, marketplace | Jira, DBs, internal APIs — Enterprise allowlists |
| **CLI / Agents Window** | CLI · Cmd palette “Agents Window” | Headless/CI; parallel local↔cloud agent workspace |

### Naming traps (don’t fumble these live)

- **Composer 2.5** = Cursor’s **model**, not a separate UI pane (old “Composer” UI ≈ today’s Agent modes)
- **Memories** removed from product — use **Rules / Team Rules / AGENTS.md / Skills**
- **Background Agents** → say **Cloud Agents**

## Context system

- Codebase indexing for large repos / monorepos (`.cursorignore` / `.cursorindexingignore`)
- `@` files, folders, docs, rules, git diffs, terminals, web
- Rules: Always / Intelligent / Glob / Manual
- Nested `AGENTS.md`

## Enterprise control plane

- **Privacy Mode** org-wide — no training by Cursor or providers (ZDR agreements)
- **SSO** SAML/OIDC; **SCIM** (Enterprise)
- Model / MCP / repository controls
- Auto-run, browser, network controls; agent sandbox
- Hooks (MDM + server-side distribution on Enterprise)
- Audit logs, service accounts, billing groups, pooled usage
- Analytics, Conversation Insights, **AI Code Tracking API**, **Cursor Blame**
- OpenTelemetry export; HIPAA BAA (Enterprise, request path)
- **Not today:** self-hosted Cursor IDE. **Do say:** private connectivity (e.g. PrivateLink / Cloudflare Tunnel) for self-hosted SCM used by Cloud Agents / Bugbot; MDM-deployed desktop client

## Pricing (list — verify on cursor.com/pricing before the meeting)

| Plan | List | Memorable inclusions |
| --- | --- | --- |
| Hobby | Free | Limited Agent |
| Pro / Pro+ / Ultra | ~$20 / $60 / $200 | Rising model pools; MCP/skills/hooks; Cloud Agents; Bugbot usage-based |
| Teams Standard / Premium | ~$40 / $120 per user/mo | Admin, marketplace, Bugbot, analytics, Privacy Mode, SSO; Premium = more Agent usage |
| Enterprise | Custom | Pooled usage, SCIM, repo/model/MCP controls, audit, AI code tracking, CMEK/residency options, priority support |

**ROI color (case studies — not contracts):** Coinbase, Box, NVIDIA, Amplitude, Vercel blogs on cursor.com/blog — pair with in-product Analytics / AI Code Tracking / Cursor Blame.

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
