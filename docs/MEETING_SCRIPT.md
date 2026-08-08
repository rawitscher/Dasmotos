# 60-minute meeting script (speaker notes)

Print or keep on a second screen. **Bold = must say.**

---

## 0:00 — Open

Thanks for the time — I’m **[Name], Field Engineer**. My AE is stuck on the tarmac, so I’ll run us end-to-end: **confirm how you’re thinking about SDLC transformation**, show Cursor in the workflows that matter at your scale, and leave hard time for security, cost, and rollout.

**Agenda:** ~15 discover · ~25 live product · rest discussion. **Interrupt me** if I’m in the wrong place.

**Assumption check:** large heterogeneous estate, Copilot already in market, goal is transforming how thousands of engineers deliver — not prettier autocomplete. **Where am I wrong?**

---

## 0:03 — Discovery (steal answers for the demo)

**CTO:** What does SDLC transformation mean in 12 months? Where is AI coding real vs theater? What would make this a no?

**VP Eng:** Where do engineers lose time — navigation, multi-repo, review, legacy? What’s the honest Copilot scorecard?

**VP DevEx:** IDE mix? Day-one governance needs? How do you prove ROI to Finance?

**Glue:** Idea → prod path; where context dies; Jira/GitHub/observability in the loop.

*Write their words on a notepad. Demo only those.*

---

## 0:18 — Point of view (60 seconds)

Copilot = strong assistant in an editor.  
Lab model = strong brain outside your SDLC.  
**Cursor = AI development platform**: codebase context, agents that plan/edit/test/PR, org knowledge via Rules/MCP, enterprise controls — idea through review.

For you I’d focus where Copilot plateaus: **multi-service changes, brownfield onboarding, PR quality, governed agents on GitHub + Jira.**

---

## 0:22 — Demo

**Arc A:** Trace payment → legacy ledger (risk of double-charge).  
**Arc B:** Idempotency via Agent + Rules + tests + OpenAPI.  
**Arc C (narrate):** Bugbot + Cloud Agents + MCP + analytics.

Say out loud: **Privacy Mode on.** Narrate recovery if anything flakes.

---

## 0:45 — Objections

Budget · security egress · JetBrains · lab DIY · legacy · ROI  
→ use `OBJECTION_DRILLS.md`

---

## 0:55 — Close

**Heard:** [3 pains]. **Showed:** [3 proofs].  
**Ask:** governed pilot with teams X/Y/Z + security session on Privacy Mode/SSO/SCIM.  
I’ll send a one-page plan tomorrow. **Who owns this on your side?**
