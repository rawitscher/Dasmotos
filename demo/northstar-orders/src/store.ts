import type { Order, Payment } from "./types.js";

/** In-memory store — stands in for Postgres + outbox in the real platform. */
export const db = {
  orders: new Map<string, Order>(),
  payments: new Map<string, Payment>(),
  /** Intentionally unused until Arc B — scaffold for idempotency demo */
  idempotency: new Map<string, string>(),
};

export function resetDb(): void {
  db.orders.clear();
  db.payments.clear();
  db.idempotency.clear();
}
