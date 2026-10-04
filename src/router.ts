import { getConfig, saveConfig } from "./config/store.ts";
import { login, loginPage } from "./auth/login.ts";
import { isAuthenticated, logout } from "./auth/session.ts";
import { generateSubscription, uriSubscription } from "./subscriptions/generators.ts";
import { html, json } from "./utils/response.ts";
import { panelPage } from "./panel/ui.ts";
import type { Storage } from "./types.ts";

export async function route(request: Request, store: Storage): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (url.pathname === "/api/health") return json({ ok: true, name: "Donagate", version: "0.2.0" });
  if (url.pathname === "/") return html(`<h1>Donagate</h1><p>Deno-native control panel is running.</p><p><a href="/login">ورود</a></p>`);
  if (url.pathname === "/login" && request.method === "GET") return html(loginPage());
  if (url.pathname === "/login" && request.method === "POST") return login(request, store);
  if (url.pathname === "/logout" && request.method === "POST") return logout(request, store);

  if (url.pathname === "/panel") {
    if (!await isAuthenticated(request, store)) return new Response(null, { status: 303, headers: { Location: "/login" } });
    return html(panelPage(await getConfig(store)));
  }

  if (url.pathname === "/api/config" && request.method === "GET") {
    if (!await isAuthenticated(request, store)) return json({ error: "unauthorized" }, 401);
    return json(await getConfig(store));
  }
  if (url.pathname === "/api/config" && request.method === "POST") {
    if (!await isAuthenticated(request, store)) return json({ error: "unauthorized" }, 401);
    const form = await request.formData();
    const old = await getConfig(store);
    const next = { ...old, publicHost: String(form.get("publicHost") ?? old.publicHost), port: Number(form.get("port") ?? old.port), protocol: String(form.get("protocol") ?? old.protocol) as typeof old.protocol, uuid: String(form.get("uuid") ?? old.uuid), trojanPassword: String(form.get("trojanPassword") ?? old.trojanPassword), panelPassword: String(form.get("panelPassword") ?? old.panelPassword) };
    if (!next.publicHost || !Number.isInteger(next.port) || next.port < 1 || next.port > 65535) return json({ error: "invalid config" }, 400);
    await saveConfig(store, next);
    return new Response(null, { status: 303, headers: { Location: "/panel" } });
  }

  const sub = url.pathname.match(/^\/api\/sub\/(xray|singbox|clash|base64)$/);
  if (sub) {
    if (!await isAuthenticated(request, store)) return json({ error: "unauthorized" }, 401);
    const config = await getConfig(store);
    if (sub[1] === "base64") return new Response(uriSubscription(config), { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": "inline; filename=donagate.txt" } });
    const format = sub[1] as "xray" | "singbox" | "clash";
    return new Response(generateSubscription(config, format), { headers: { "Content-Type": format === "clash" ? "text/yaml; charset=utf-8" : "application/json; charset=utf-8" } });
  }
  return new Response("Not Found", { status: 404 });
}
