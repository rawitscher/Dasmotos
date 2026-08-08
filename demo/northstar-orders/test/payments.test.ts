import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { createOrder } from "../src/ordersService.js";
import { createPayment } from "../src/paymentsService.js";
import { resetDb } from "../src/store.js";

describe("paymentsService", () => {
  beforeEach(() => resetDb());

  it("captures a payment against the legacy ledger", async () => {
    const order = createOrder({
      customerId: "cust_99",
      amountCents: 999,
      currency: "USD",
    });
    const payment = await createPayment({ orderId: order.id });
    assert.equal(payment.status, "captured");
    assert.ok(payment.legacyRef?.startsWith("LGR-"));
  });

  it("fails when order is missing", async () => {
    await assert.rejects(() => createPayment({ orderId: "nope" }));
  });
});
