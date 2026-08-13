# GlobalPharm — Run of Show (60 min)

**You run it end to end. The AE is stranded.**
Panel in character: **CTO** (AI strategy across R&D + commercial) · **VP Engineering** (delivery + quality in the regulated stack) · **VP DevEx** (whether any of this gets adopted).

Customer: **GlobalPharm**, top-10 pharma. Playbook baseline ~80k employees / ~6k engineers; your assignment says ~70k / ~5k — pick one and stay consistent. Either way: 5,000+ engineers, many business units, GitHub Copilot already deployed (uneven adoption), evaluating expand-Copilot vs Cursor vs a lab-led build.

> One discipline throughout: **do not quote unverified numbers.** Where you'd reach for a stat (token reduction, Bugbot timings, Box %, per-seat price), say: *"I'd rather give you our current published figure than one from memory — I'll send it with the recap."* Refusing to oversell is the trust move.

## Clock

| Time | Segment | Deck |
|---|---|---|
| 0:00–0:03 | Open. AE situation once. Confirm attendees + what each needs. | 1 |
| 0:03–0:05 | Contract for the hour. Say the times out loud. | — |
| 0:05–0:15 | **Discovery** (graded). Refuse-to-demo open, recap, ask. | 2 |
| 0:15–0:19 | The pain ladder. Get explicit agreement on L2. | 3 |
| 0:19–0:22 | The compression: why Cursor. Value, not features. | 4 |
| 0:22–0:25 | Mirror their lifecycle onto the surfaces. | 5 |
| 0:25–0:42 | Name the two places, then **live demo** (the spine). | — |
| 0:42–0:50 | Objections, concede-first. | — |
| 0:50–0:54 | Named controls — governed velocity. | 6 |
| 0:54–0:58 | The 12-week pilot, guardrails first. Then stop. | 7 |
| 0:58–1:00 | Close by interviewing them. Owners + dates. | — |

**Hard rule:** at 0:42 stop demoing, mid-anything: *"I'm going to stop there — I want the last twenty minutes for your questions, not my screen."*

## 0:00 — Opening

> "Before we start — my AE's flight is still on the tarmac, so you've got me for the whole hour. I'd rather run it than reschedule you, and I'd rather spend the time on your questions than my slides.
> Quick round: [CTO], you're carrying AI strategy across R&D and commercial. [VP Eng], you own delivery and quality in the regulated stack. [VP DevEx], you own whether any of this actually gets adopted. Fair — and is there anything each of you specifically needs out of the next hour?"

Then the contract:

> "Ten minutes making sure I understand your world — correct me, I'd rather be wrong now than at minute forty. Then the demo. And I'm stopping the demo at forty-two so we have real time for security and cost. Work for you?"

**State assumptions once (right after):** ~80k/6k (or your chosen numbers); Copilot on ~3,000 engineers, uneven, one heavy security review already done; GitHub Enterprise + Atlassian + mixed CI/CD + Datadog/Splunk; mixed estate incl. .NET/Java monoliths, stored procs, some COBOL in supply chain/finance; **every number on slide 4 is a target vs their baseline, not a promise.**

## 0:05 — Discovery (the graded segment)

Open with the **refusal**:

> "I'm not going to demo yet. Walk me through the last meaningful change you shipped — request through to production — and tell me where it sat waiting. Then I'll show you the two places I'd attack first."

Then work seven dimensions — **ask** three, **confirm** the ones you've assumed:

| Dimension | Mode | After |
|---|---|---|
| SDLC | Ask | Where a change *waits*, not the process |
| Pain | Ask | The one bottleneck worth money |
| Org shape | Ask | Champion vs economic buyer — who signs |
| CI/CD | Ask | A baseline number for slide 4 |
| Buying process | Ask | What it takes to close (shapes the pilot) |
| Security posture | Confirm | "You ran a heavy Copilot review; not keen on a second. How wrong am I?" |
| Current AI usage | Confirm | "~3,000 seats, uneven adoption." Shadow AI = demand, not scandal. |

Tag every answer **fact / hypothesis / unknown** out loud. Unknowns become the next-meeting agenda.

**Pharma-specific questions that nobody else asks:**
- "For a change to a **validated system**, what evidence does a QA reviewer need, and who assembles it?" (sets up the demo)
- "Which systems do engineers **avoid touching**, and why?" (surfaces fear: the god-class service, the COBOL supply-chain job)
- "Where is software on the **critical path** for your most expensive delay — trial data, submission, batch release?"

**Pay the promise:** before sharing screen, name the two places tied to their words: *"you said release changes sit weeks in validation evidence, and nobody's sure the audit trail is complete — those are the two I'd attack. Here's the first."*

## Value chain (say it, don't slide it)

Carry every pain through: **pain → capability → metric → economic unit.**
Economic units that land in pharma: engineer-hours/sprint, days off cycle time, and — for the CFO — **pull-forward revenue** (a change reaching prod in weeks not quarters moves roadmap + revenue forward).

> "Your champions will tell you it feels faster. A CFO doesn't buy feelings. I'd translate every win into engineer-hours, days off cycle time, and how much earlier the work lands."

## 0:42 — Objections
See [OBJECTIONS.md](OBJECTIONS.md). Rail: **concede → reframe → prove → name the control + owner.**

## 0:50 — Governed velocity (slide 6)
The named controls, the slide your champion forwards: separation of duties, policy-as-config, blast-radius allowlist, ITGC evidence, human holds the merge key.

## 0:54 — Pilot (slide 7)
**Guardrails first, enablement second, expansion third.** Baseline day-zero on four lenses: adoption, flow, quality/safety, experience/trust. Deliberately **defer autonomous agents in CI to phase two** out loud — scoping out the riskiest item is a credibility move.

## 0:58 — Close by interviewing them
Not "any questions?" Turn the table (pick 2–3):
- "Where does code review actually bottleneck — reviewer availability or scope of changes?"
- "Who owns the merge gate, and what evidence does audit need on every PR?"
- "What's your blast-radius rule — which repos would you fence off first?"
- "If you ran this pilot, what one metric makes your VP say yes?"

Then: *"What would have to be true to approve this in the next thirty days?"* Get names + dates before anyone stands up.
