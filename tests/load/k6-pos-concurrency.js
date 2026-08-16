import http from "k6/http";
import { check, sleep } from "k6";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — k6 Concurrency Benchmark: POS Checkout
 * ═══════════════════════════════════════════════════════════════
 * Run with: k6 run tests/load/k6-pos-concurrency.js
 */

export const options = {
  scenarios: {
    peak_pos_traffic: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 50 }, // Ramp up to 50 concurrent cashiers
        { duration: "20s", target: 50 }, // Hold steady peak
        { duration: "10s", target: 0 },  // Ramp down
      ],
      gracefulRampDown: "5s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // Less than 1% 500 errors
    http_req_duration: ["p(95)<350"], // 95% requests complete under 350ms
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const payload = JSON.stringify({
    items: [
      {
        productId: "mock_product_supplement_123",
        quantity: 1,
        price: 2500,
      },
    ],
    paymentMethod: "UPI",
    subtotal: 2500,
    tax: 450,
    discount: 0,
    total: 2950,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": "mock_tenant_eagle",
    },
  };

  const res = http.post(`${BASE_URL}/api/pos/checkout`, payload, params);

  check(res, {
    "status is 200 or 400 (no 500 crashes)": (r) => r.status === 200 || r.status === 400,
    "response time under 500ms": (r) => r.timings.duration < 500,
  });

  sleep(0.1);
}
