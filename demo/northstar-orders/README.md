# Northstar Orders (demo)

Brownfield-flavored order + payments service for Cursor Field Eng live demos.

## Story

Northstar Financial’s retail banking platform still routes card captures through a **legacy ledger adapter** (stand-in for a mainframe/VB6 bridge). The Node service grew organically: inconsistent error shapes, no idempotency, thin tests, tribal knowledge in Slack.

## Run

```bash
cd demo/northstar-orders
npm install
npm test
npm run dev   # http://localhost:3847
```

## Demo prompts that work well

**Arc A — understand**

> Trace how a card payment flows from `POST /v1/payments` to the legacy ledger. List failure modes and where money could double-charge.

**Arc B — multi-file change**

> Add idempotency-key support on payment creation. Persist keys, reject replays with the original response, update OpenAPI + tests. Follow project rules.

**Arc C — docs / onboarding**

> Write a 1-page onboarding note for a new engineer owning this service. Link to the risky paths.

## Intentional gaps (for the demo)

- No idempotency keys yet
- `LegacyLedgerClient` simulates flaky mainframe latency + duplicate posts
- Mixed coding styles in `ordersService` vs `paymentsService`
- OpenAPI slightly out of date with handlers
