import { assertEquals, assertMatch } from "jsr:@std/assert@1";
import { MemoryStore } from "../src/services/storage.ts";
import { route } from "../src/router.ts";
import { generateSubscription } from "../src/subscriptions/generators.ts";
import { defaultConfig } from "../src/config/defaults.ts";

Deno.test("health endpoint", async () => {
  const res = await route(new Request("http://localhost/api/health"), new MemoryStore());
  assertEquals(res.status, 200);
  assertMatch(await res.text(), /Donagate/);
});

Deno.test("subscription generators", () => {
  assertMatch(generateSubscription(defaultConfig, "xray"), /outbounds/);
  assertMatch(generateSubscription(defaultConfig, "singbox"), /server_port/);
  assertMatch(generateSubscription(defaultConfig, "clash"), /proxies/);
});
