export type Currency = "USD" | "EUR" | "GBP";

export type OrderStatus = "draft" | "submitted" | "paid" | "failed" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  amountCents: number;
  currency: Currency;
  status: OrderStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amountCents: number;
  currency: Currency;
  status: "pending" | "captured" | "failed";
  legacyRef?: string;
  createdAt: string;
}

export interface CreateOrderInput {
  customerId: string;
  amountCents: number;
  currency: Currency;
}

export interface CreatePaymentInput {
  orderId: string;
  /** Missing today — demo Arc B adds this */
  idempotencyKey?: string;
}
