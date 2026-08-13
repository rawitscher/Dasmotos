import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { createOrder, getOrder } from "../src/ordersService.js";
import { resetDb } from "../src/store.js";

describe("ordersService", () => {
  beforeEach(() => resetDb());

  it("creates a submitted order", () => {
    const order = createOrder({
      customerId: "cust_1",
      amountCents: 2500,
      currency: "USD",
    });
    assert.equal(order.status, "submitted");
    assert.equal(getOrder(order.id)?.amountCents, 2500);
  });

  it("rejects non-positive amounts", () => {
    assert.throws(() =>
      createOrder({ customerId: "cust_1", amountCents: 0, currency: "USD" }),
    );
  });
});
