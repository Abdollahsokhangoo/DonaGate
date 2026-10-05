import { assertEquals, assertMatch } from "jsr:@std/assert@1";
import { MemoryStore } from "../src/services/storage.ts";
import { route } from "../src/router.ts";
import { generateSubscription, vlessUri, trojanUri } from "../src/subscriptions/generators.ts";
import { defaultConfig } from "../src/config/defaults.ts";

Deno.test("health endpoint", async () => {
  const res = await route(new Request("http://localhost/api/health"), new MemoryStore(), "memory");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.version, "0.3.0");
  assertEquals(body.storage, "memory");
});

Deno.test("subscription generators produce expected structure", () => {
  const cfg = { ...defaultConfig, network: "ws" as const, path: "/tunnel", sni: "cdn.example.com" };

  assertMatch(generateSubscription(cfg, "xray"), /streamSettings/);
  assertMatch(generateSubscription(cfg, "xray"), /wsSettings/);
  assertMatch(generateSubscription(cfg, "singbox"), /transport/);
  assertMatch(generateSubscription(cfg, "clash"), /ws-opts/);
  assertMatch(vlessUri(cfg), /type=ws/);
  assertMatch(vlessUri(cfg), /path=%2Ftunnel/);
  assertMatch(trojanUri(cfg), /type=ws/);
});

Deno.test("login page renders", async () => {
  const res = await route(new Request("http://localhost/login"), new MemoryStore(), "memory");
  assertEquals(res.status, 200);
  assertMatch(await res.text(), /ورود به Donagate/);
});
