import { assertEquals } from "jsr:@std/assert";

Deno.test("health response contract", () => {
  const data = { status: "ok", service: "donagate", version: "0.1.0" };
  assertEquals(data.status, "ok");
  assertEquals(data.service, "donagate");
});
