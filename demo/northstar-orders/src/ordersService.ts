import { randomUUID } from "node:crypto";
import { db } from "./store.js";
import type { CreateOrderInput, Order } from "./types.js";

export function createOrder(input: CreateOrderInput): Order {
  if (!input.customerId?.trim()) {
    throw new Error("customerId required");
  }
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error("amountCents must be a positive integer");
  }

  const order: Order = {
    id: randomUUID(),
    customerId: input.customerId.trim(),
    amountCents: input.amountCents,
    currency: input.currency,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  db.orders.set(order.id, order);
  return order;
}

export function getOrder(orderId: string): Order | undefined {
  return db.orders.get(orderId);
}

export function listOrders(): Order[] {
  return [...db.orders.values()].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}
