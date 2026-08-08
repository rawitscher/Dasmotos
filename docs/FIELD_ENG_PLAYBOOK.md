# Field Eng Pitch & Demo Playbook

**Scenario:** AE stranded. You own the full 60 minutes with CTO / VP Eng / VP DevEx at a 5,000+ engineer enterprise evaluating Cursor vs expanding GitHub Copilot vs a lab-led (Anthropic/OpenAI) approach.

**Chosen customer (assumption):** **Northstar Financial** — global bank/fintech. Mix of Java/Kotlin microservices, a large .NET/Java monolith, internal platform teams, and pockets of VB6/COBOL. Stack: GitHub Enterprise, Jira, Datadog, Jenkins/GitHub Actions. Copilot Business rolled out to ~40% of engineers with uneven adoption.

---

## 0. Mindset (what the panel grades)

| Signal | What “great” looks like |
| --- | --- |
| Framing | You own the room; AE absence is invisible |
| Discovery | Confirm *their* world before pitching |
| Tailoring | Demo maps to pains they just named |
| Differentiation | Clear vs Copilot *and* vs “just use Claude/GPT” |
| Business case | ROI, risk, change mgmt — not feature bingo |
| Close | Concrete next step (POV / pilot design) |

---

## 1. Clock (60 min)

| Min | Block | Goal |
| --- | --- | --- |
| 0–3 | Open | Credibility + agenda + permission to discover |
| 3–18 | Discovery | Stakeholder map, SDLC goals, Copilot reality, constraints |
| 18–22 | Point of view | 60-second thesis: where Cursor fits *their* transformation |
| 22–45 | Live demo | 3 tailored arcs (see §4) — leave ~5 min buffer |
| 45–55 | Objections | Budget, security, JetBrains, legacy, change |
| 55–60 | Close | Recap value → proposed pilot → owners + date |

If discovery runs hot, **cut demo arc #3**, not discovery. Tailored > complete.

---

## 2. Opening (90–120 seconds)

> “Thanks for making time — I’m [Name], Field Engineer. My AE partner is stuck on the tarmac, so I’ll run us end-to-end today: confirm what I think I understand about Northstar’s SDLC goals, then show Cursor in the workflows that matter for a shop your size, and leave time for hard questions on risk, cost, and rollout.
>
> Agenda: ~15 min discovery, ~20–25 min live product, then open discussion. Fair?
>
> One ask: interrupt me. If I’m demoing something irrelevant to how you ship, stop me.”

Then **confirm assumptions** (don’t pretend you know their org):

> “Going in, I’m assuming: large heterogeneous estate, Copilot already in market, goal isn’t ‘more autocomplete’ — it’s transforming how 5k engineers deliver across modern and legacy systems. Where am I wrong?”

---

## 3. Discovery script

Ask fewer, sharper questions. Map each answer to a demo beat.

### CTO (outcomes / risk / portfolio)

1. What does “SDLC transformation” mean in the next 12–18 months — velocity, quality, platform consolidation, AI strategy?
2. Where is AI coding already creating value — and where is it theater?
3. What would make this evaluation a *no* — security, IDE lock-in, cost unpredictability, weak ROI proof?

### VP Engineering (delivery / architecture)

4. Where do engineers lose the most time: navigating unfamiliar services, multi-repo changes, flaky CI, review lag, legacy ownership?
5. How painful is cross-team / cross-repo work today (FE + BE + platform)?
6. What’s the real Copilot story — seat utilization, where it helps, where seniors still refuse it?

### VP DevEx (adoption / governance / tooling)

7. What’s your IDE reality — VS Code heavy, JetBrains heavy, mixed?
8. What governance do you need day one: SSO/SCIM, privacy/no-training, model allowlists, audit, spend caps?
9. How do you measure developer productivity today — and what would prove AI ROI to Finance?

### Glue questions (always)

10. Walk me through idea → production for a typical change. Where does context die?
11. How do Jira / GitHub / observability show up in a developer’s day?
12. Legacy: are you modernizing in place, strangling, or both — and who still understands those systems?

**Listen for → demo map**

| They say… | You show… |
| --- | --- |
| “Copilot is fine for boilerplate” | Agent multi-file + codebase understanding |
| “Context doesn’t survive across services” | `@codebase`, multi-root / Cloud Agent multi-repo |
| “Reviews are the bottleneck” | Bugbot on PRs + Fix in Cursor / Cloud |
| “Security will kill this” | Privacy Mode, SSO/SCIM, model/MCP controls, hooks, audit |
| “We have JetBrains shops” | Cursor CLI / ACP / JetBrains agent path; honest dual-track rollout |
| “Labs say just use their API” | IDE+agent+index+governance vs chat+copy-paste |
| “Legacy / tribal knowledge” | Agent explores + Rules/AGENTS.md encode org knowledge |
| “Cost / seats” | Pooled usage, spend limits, analytics, AI code tracking |

---

## 4. Point of view (say this before demo)

> “Copilot is a strong assistant *inside* an editor. A lab model is a strong brain *outside* your SDLC. What enterprises like yours are buying with Cursor is an **AI development platform**: deep codebase context, agents that can plan/edit/test/PR, org knowledge via Rules/MCP, and enterprise controls — so AI shows up from idea through review, not only at the caret.
>
> For Northstar, I’d focus Cursor where Copilot plateaus: multi-service changes, onboarding into brownfield systems, PR quality at scale, and governed agent workflows tied to GitHub + Jira.”

---

## 5. Live demo arcs (pick 3 based on discovery)

Repo for practice: `demo/northstar-orders` in this branch.

### Arc A — “Understand the brownfield” (CTO + Eng love this)

**Story:** New engineer owns a payment/order path they didn’t write.

1. Open `demo/northstar-orders`
2. Agent (Ask/Plan): *“Trace how a card payment flows from API → ledger adapter. Call out risk points and dead code.”*
3. Show codebase search / citations, not vibes
4. Optional: generate a short architecture note they could paste into Confluence

**Punchline:** Context is the product. ChatGPT in a browser doesn’t have your index, rules, or repo tools.

### Arc B — “Multi-file change with guardrails” (vs Copilot)

1. Show `.cursor/rules` (or Team Rules narrative)
2. Agent: *“Add idempotency keys to payment creation; update service, tests, and OpenAPI; follow our rules.”*
3. Point at checkpoints / review diff
4. Run tests in terminal via Agent

**Punchline:** Not autocomplete — an agent that edits, verifies, and respects org standards.

### Arc C — “SDLC, not just the IDE” (DevEx + CTO)

Narrate (or live if connected):

- **Bugbot:** PR review that catches real bugs; `cursor review` / Fix in Web
- **Cloud Agents:** kick off from Slack/GitHub/Jira; parallel work; artifacts/PR
- **MCP:** Jira ticket → implementation context; admin allowlists for enterprise
- **Analytics / AI Code Tracking:** how DevEx proves adoption and impact

**Punchline:** Labs sell models. Copilot sells assistance. Cursor instruments the *loop*.

### Arc D — emergency spare: Tab + Cmd/Ctrl+K

If Agent flakes: Tab multi-line/cross-file + Inline Edit for a tight “feels 10x” moment, then return to Agent.

### Demo hygiene

- Pre-index the repo; warm a sample prompt
- Privacy Mode on (say it out loud for Security)
- One model switch: “best model for the job” (Composer vs frontier)
- Never demo and talk over failures — narrate recovery (checkpoint, re-prompt)
- Stay in *their* language from discovery

---

## 6. Competitive framing (honest, sharp)

### vs GitHub Copilot

| Dimension | Cursor angle |
| --- | --- |
| Product shape | AI-native IDE + agents + cloud loop vs assistant plugin |
| Context | Repo intelligence + rules + MCP as first-class |
| Agent depth | Multi-file, terminal, browser, checkpoints, cloud VMs |
| Review | Bugbot agentic review in the PR path |
| Models | Frontier choice + Cursor models; org allow/deny |
| Governance | Privacy Mode org-wide, SCIM, audit, hooks, MCP/model/repo controls |
| Gap to own | Multi-IDE (JetBrains/Xcode/VS) — plan dual-track / CLI / ACP; don’t hand-wave |

**Line:** “If the job is better suggestions in the editor you already love, Copilot is rational. If the job is transforming how work moves across a complex estate, you need agents with environment + governance — that’s Cursor.”

### vs lab-led (Claude/ChatGPT/API)

| Dimension | Cursor angle |
| --- | --- |
| Workflow | Model in the loop of files, tests, PRs, tools |
| Context | Indexing, @-mentions, rules, team marketplace |
| Admin | SSO/SCIM, spend, audit, sandboxes — not DIY |
| Cost of ownership | Building an internal “Cursor” is a multi-year platform bet |
| Safety | Hooks, auto-run/network controls, Bugbot — not a chat window |

**Line:** “You’re not choosing a model — you’re choosing whether every team reinvents the harness around the model.”

### Both-and (advanced)

Many enterprises keep Copilot for niche IDE users while standardizing Cursor for VS Code-oriented majority + agent workflows. Offer a **phased design**, not religious war.

---

## 7. Business case talking points

**ROI levers (tie to their metrics):**

- Cycle time on cross-service changes
- Time-to-first-commit for new hires / transferred teams
- PR rework rate / escaped defects (Bugbot)
- Legacy modernization throughput
- Platform leverage: Rules + MCP + Cloud Agents as shared capability

**Rough narrative math (use *their* numbers in-room):**

> “If Cursor saves even 30–60 minutes/day for half of 5,000 engineers, that’s thousands of engineering-hours/week. Seat cost is noise next to fully loaded eng cost — the real questions are adoption quality and risk controls.”

**Cost controls to name:** pooled usage (Enterprise), spend limits, billing groups, analytics, model routing.

**Change management:**

1. Security/privacy review via trust.cursor.com (SOC 2 Type II, Privacy Mode / ZDR story)
2. SSO + SCIM + MDM
3. Design-partner squads (2–3 teams with real backlog)
4. Codify wins into Team Rules / marketplace skills
5. Expand with DevEx office hours + success metrics dashboard

---

## 8. Objection flashcards

**“We already pay for Copilot.”**  
Complement or replace by workflow, not brand. Measure head-to-head on multi-file + review + onboarding tasks — not Hello World.

**“Our developers won’t switch IDEs.”**  
Acknowledge. VS Code migrants are low friction. JetBrains: Cursor agent via ACP/CLI paths + phased rollout. Don’t pretend everyone moves Monday.

**“Code leaving our boundary is a blocker.”**  
Privacy Mode org-wide, no training; ZDR with providers; trust center; model controls; hooks; audit logs; network allowlists; no on-prem today — be straight, offer private connectivity patterns for source control.

**“What about COBOL/VB6?”**  
Agents help explain, document, wrap, and strangler-fig — not magically delete mainframes. Pair with Rules that encode tribal knowledge.

**“Anthropic/OpenAI will give us models cheaper.”**  
Models commoditize; harness + context + governance compound. Cursor ships multi-model so you’re not married to one lab.

**“Security won’t allow autocomplete on prod repos.”**  
Repo blocklists, model allowlists, MCP allowlists, sandbox/auto-run controls, service accounts — design the control plane *with* them.

**“Prove ROI.”**  
Pilot design: 3 teams × 4–6 weeks, baseline cycle time + PR metrics, AI Code Tracking / analytics, qualitative preference (cite public: high engineer preference in head-to-heads — use cautiously).

**“On-prem?”**  
Not offered today; AWS + enterprise controls + private connectivity options. Don’t invent VPC-Cursor.

---

## 9. Close (clean)

> “Here’s what I heard: [3 pains]. Here’s what I showed that maps: [3 capabilities].  
> Proposed next step: a governed pilot with [Team A/B/C], success metrics we draft with DevEx, and a security working session on Privacy Mode + SSO/SCIM next week.  
> If that feels right, I’ll send a one-page pilot plan tomorrow. Who owns this on your side?”

**Leave-behind:** this playbook’s one-pager (`docs/ONE_PAGER.md`) + link to trust.cursor.com + pilot outline.

---

## 10. Assumptions to state if asked

- Northstar-style financial services customer (swap industry freely)
- Copilot partially deployed, mixed satisfaction
- GitHub + Jira canonical
- Evaluation criteria: SDLC transformation, not editor aesthetics
- Success = clear pilot path with security path, not a same-day close
