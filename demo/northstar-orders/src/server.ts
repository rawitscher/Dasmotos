import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createOrder, getOrder, listOrders } from "./ordersService.js";
import { createPayment, getPayment } from "./paymentsService.js";
import type { CreateOrderInput, Currency } from "./types.js";

const PORT = Number(process.env.PORT ?? 3847);

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function notFound(res: ServerResponse): void {
  send(res, 404, { error: "not_found" });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    const { pathname } = url;
    const method = req.method ?? "GET";

    if (method === "GET" && pathname === "/health") {
      return send(res, 200, { ok: true, service: "northstar-orders" });
    }

    if (method === "GET" && pathname === "/v1/orders") {
      return send(res, 200, { data: listOrders() });
    }

    if (method === "POST" && pathname === "/v1/orders") {
      const body = (await readJson(req)) as CreateOrderInput;
      const order = createOrder({
        customerId: body.customerId,
        amountCents: body.amountCents,
        currency: (body.currency ?? "USD") as Currency,
      });
      return send(res, 201, { data: order });
    }

    const orderMatch = pathname.match(/^\/v1\/orders\/([^/]+)$/);
    if (method === "GET" && orderMatch) {
      const order = getOrder(orderMatch[1]!);
      if (!order) return send(res, 404, { error: "order_not_found" });
      return send(res, 200, { data: order });
    }

    if (method === "POST" && pathname === "/v1/payments") {
      const body = (await readJson(req)) as { orderId?: string };
      if (!body.orderId) return send(res, 400, { error: "orderId_required" });
      const payment = await createPayment({ orderId: body.orderId });
      return send(res, 201, { data: payment });
    }

    const paymentMatch = pathname.match(/^\/v1\/payments\/([^/]+)$/);
    if (method === "GET" && paymentMatch) {
      const payment = getPayment(paymentMatch[1]!);
      if (!payment) return send(res, 404, { error: "payment_not_found" });
      return send(res, 200, { data: payment });
    }

    return notFound(res);
  } catch (e: any) {
    const status = typeof e?.status === "number" ? e.status : 500;
    return send(res, status, {
      error: e?.message ?? "internal_error",
      ledgerCode: e?.ledgerCode,
    });
  }
});

server.listen(PORT, () => {
  console.log(`northstar-orders listening on http://localhost:${PORT}`);
});
