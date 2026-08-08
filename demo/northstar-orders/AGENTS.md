# Northstar Orders — agent notes

This is a **demo** brownfield service for Cursor Field Engineering.

## Domain

- Orders are created, then payments capture funds via a flaky legacy ledger bridge.
- Double-charge risk on retries is the headline incident class.

## Conventions

- TypeScript, NodeNext modules, `tsx` for run/test.
- Keep the HTTP server dependency-free (no Express) unless asked.
- Prefer small, reviewable diffs.

## When implementing idempotency

1. Store mapping idempotency key → payment id
2. Replay must return the original payment payload with `200` or `201` consistently
3. Keys should be scoped per caller in real life; in-memory map is fine for demo
