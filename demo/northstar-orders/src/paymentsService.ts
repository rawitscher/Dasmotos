import { randomUUID } from "node:crypto";
import { legacyLedger, LedgerError } from "./legacy/ledgerClient.js";
import { getOrder } from "./ordersService.js";
import { db } from "./store.js";
import type { CreatePaymentInput, Payment } from "./types.js";

/**
 * WARNING (from #payments-oncall, 2024-11):
 * Clients retry aggressively. Without idempotency we have double-captures
 * against the ledger roughly a few times a month during incident traffic.
 */
export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const order = getOrder(input.orderId);
  if (!order) {
    // inconsistent error style vs ordersService — intentional demo smell
    const err: any = new Error("order not found");
    err.status = 404;
    throw err;
  }

  if (order.status === "paid") {
    const err: any = new Error("order already paid");
    err.status = 409;
    throw err;
  }

  const payment: Payment = {
    id: randomUUID(),
    orderId: order.id,
    amountCents: order.amountCents,
    currency: order.currency,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const ledger = await legacyLedger.postCapture({
      accountHint: order.customerId,
      amountCents: order.amountCents,
      currency: order.currency,
      narrative: `order:${order.id}`,
    });
    payment.status = "captured";
    payment.legacyRef = ledger.legacyRef;
    order.status = "paid";
  } catch (e) {
    payment.status = "failed";
    order.status = "failed";
    db.payments.set(payment.id, payment);
    if (e instanceof LedgerError) {
      const err: any = new Error(`ledger: ${e.code} ${e.message}`);
      err.status = 502;
      err.ledgerCode = e.code;
      throw err;
    }
    throw e;
  }

  db.payments.set(payment.id, payment);
  db.orders.set(order.id, order);
  return payment;
}

export function getPayment(paymentId: string): Payment | undefined {
  return db.payments.get(paymentId);
}
