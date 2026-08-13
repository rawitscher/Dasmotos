# GlobalPharm — Objections (concede-first)

**Rail, every time:** concede what's true → reframe to the real question → prove with a guardrail or metric → **name the control and its owner.** Objections are buying signals; the concession earns the right to be heard.

> Numbers discipline: where a stat would go, most are marked **[verify — send with recap]**. Getting one wrong in front of this panel is worse than not citing it.

---

### 1 · "We can't send source code to a third party." (the pharma blocker)
- **Concede:** "You're right to be paranoid — your source and your trial data are crown jewels."
- **Prove:** Privacy Mode (enforceable org-wide on Enterprise), zero-data-retention terms with model providers, SOC 2 Type II, SSO/SCIM/RBAC, model + repo allowlists, audit logs. Indexing stores hashed embeddings, not your raw code long-term. Point to trust.cursor.com.
- **Volunteer the precision (before their security review finds it):** self-hosted / private workers run the *container* in your network, but **inference still calls the model provider's API**. "Self-hosted" ≠ self-hosted inference. **ZDR does not apply if you bring your own API keys.**
- **Name it:** *that's your data-handling control plane, owned by your security team.*

### 2 · "Copilot is basically free in our bundle."
- **Concede:** "Bundled pricing is real; I won't argue it on a spreadsheet."
- **Reframe:** You're comparing autocomplete to a **governed agent** — reviewable Plans, repo-scoped Rules, automated review, audit trail. Unit isn't cost/seat, it's **throughput per governed engineer**.
- **Prove:** Two things price can't touch — **model neutrality** (run any frontier model, switch as the frontier moves; a single-vendor bundle can't follow it) and the **harness** (context caching/enrichment tuned per model). 3,000 seats already told you what autocomplete does for your plateau.
- **Name it:** move the comparison to the value stream, off the license line-item.

### 3 · "Anthropic/OpenAI can just give us an agent."
- **Concede:** "The models are excellent — we route to them."
- **Reframe:** The question is who builds the fifty things between a good model and a *governed workflow* — repo integration, plan/review modes, rules, analytics, IDE, enablement.
- **Prove:** That's a platform team you'd staff and keep staffed. Analogy: a MacBook vs a box of PC parts — one ships value Monday.
- **Name it:** that layer is our product, not your side project.

### 4 · "We tried AI and it wrote garbage."
- **Concede:** "Almost certainly true — ungoverned AI on a complex repo does write garbage."
- **Reframe:** Garbage comes from the absence of guardrails, not from AI.
- **Prove:** Offer the **rules ON vs OFF** run live on the batch-release repo. Layered pre-PR pipeline: rules + Plans + Bugbot + review.
- **Name it:** policy-as-config + automated review.

### 5 · "Our seniors hate this."
- **Concede:** "Good — skeptical seniors are exactly who you want gatekeeping it."
- **Reframe:** Cursor keeps the senior in the **reviewer seat**: Ask-mode explore, a plan they approve, a merge they own. (Empirically, experienced devs are *more* likely to plan-before-generate — that instinct is what the tool is built around.)
- **Name it:** human-in-the-loop / separation of duties.

### 6 · "Juniors will stop learning."
- **Concede:** "Real risk — copy-paste without understanding is a genuine failure mode."
- **Reframe:** Ask mode is a teaching tool ("explain this call graph"); Plans force juniors to articulate intent; the review gate stays.
- **Name it:** review gate + mentorship motion.

### 7 · "Our codebase is too weird / legacy / big." (COBOL, VB6, monoliths)
- **Concede:** "Fair — legacy monoliths are the hard case."
- **Reframe:** That's exactly why I demoed on your ugliest validated service, not a scaffold. Context + repo-scoped rules + Ask-mode mapping are built for weird.
- **Be honest about the ceiling:** on COBOL/VB6, **comprehension and test generation hold up better than generation** — and in code nobody wants to touch, comprehension is most of the value.
- **Name it:** context engineering + repo-scoped rules.

### 8 · "Justify the cost."
- At 5–6k engineers, **engineering time dominates; model spend is a rounding error beside it.**
- "I'd rather not defend a number I can't source. Baseline your pilot repos in weeks 0–2, re-measure in week 11. If it doesn't move, you have a cheap, clean no."
- ROI is a journey: qualitative (are devs excited) → quantitative (cycle time, escaped defects, % code turned over) → dollars (**pull-forward revenue**).
- **Refuse "lines of AI code"** if an exec asks — it rewards volume and is trivially gamed. Redirect to cycle time and escaped defects.

---

**The six-word habit:** *"You're right — and here's the part that changes the picture."* Concession buys sixty seconds of real attention.
