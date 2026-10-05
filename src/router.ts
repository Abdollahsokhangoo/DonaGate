import { getConfig, saveConfig } from "./config/store.ts";
import { login, loginPage } from "./auth/login.ts";
import { isAuthenticated, logout } from "./auth/session.ts";
import { generateSubscription, uriSubscription } from "./subscriptions/generators.ts";
import { html, json } from "./utils/response.ts";
import { panelPage } from "./panel/ui.ts";
import type { AppConfig, Network, Protocol, Storage } from "./types.ts";

function isValidUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function route(
  request: Request,
  store: Storage,
  storageKind: "memory" | "kv",
): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (url.pathname === "/api/health") {
    return json({
      ok: true,
      name: "Donagate",
      version: "0.3.0",
      storage: storageKind,
    });
  }

  if (url.pathname === "/") {
    return html(
      `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>Donagate</title></head>
      <body style="font-family:system-ui;max-width:640px;margin:60px auto;padding:20px">
        <h1>Donagate</h1>
        <p>پنل کنترل مبتنی بر Deno در حال اجراست.</p>
        <p><a href="/login">ورود به پنل</a> · <a href="/api/health">Health</a></p>
      </body></html>`,
    );
  }

  if (url.pathname === "/login" && request.method === "GET") {
    return html(loginPage());
  }
  if (url.pathname === "/login" && request.method === "POST") {
    return login(request, store);
  }
  if (url.pathname === "/logout" && request.method === "POST") {
    return logout(request, store);
  }

  if (url.pathname === "/panel") {
    if (!(await isAuthenticated(request, store))) {
      return new Response(null, { status: 303, headers: { Location: "/login" } });
    }
    return html(panelPage(await getConfig(store), storageKind));
  }

  if (url.pathname === "/api/config" && request.method === "GET") {
    if (!(await isAuthenticated(request, store))) return json({ error: "unauthorized" }, 401);
    return json(await getConfig(store));
  }

  if (url.pathname === "/api/config" && request.method === "POST") {
    if (!(await isAuthenticated(request, store))) return json({ error: "unauthorized" }, 401);

    const form = await request.formData();
    const old = await getConfig(store);

    const next: AppConfig = {
      ...old,
      publicHost: String(form.get("publicHost") ?? old.publicHost).trim(),
      port: Number(form.get("port") ?? old.port),
      protocol: (String(form.get("protocol") ?? old.protocol) as Protocol),
      network: (String(form.get("network") ?? old.network) as Network),
      path: String(form.get("path") ?? old.path).trim() || "/ws",
      sni: String(form.get("sni") ?? old.sni).trim(),
      uuid: String(form.get("uuid") ?? old.uuid).trim(),
      trojanPassword: String(form.get("trojanPassword") ?? old.trojanPassword),
      panelPassword: String(form.get("panelPassword") ?? old.panelPassword),
    };

    if (!next.publicHost) return json({ error: "publicHost is required" }, 400);
    if (!Number.isInteger(next.port) || next.port < 1 || next.port > 65535) {
      return json({ error: "invalid port" }, 400);
    }
    if (next.protocol !== "vless" && next.protocol !== "trojan") {
      return json({ error: "invalid protocol" }, 400);
    }
    if (next.network !== "ws" && next.network !== "tcp") {
      return json({ error: "invalid network" }, 400);
    }
    if (!isValidUuid(next.uuid)) {
      return json({ error: "invalid uuid format" }, 400);
    }
    if (!next.panelPassword || next.panelPassword.length < 4) {
      return json({ error: "panel password too short" }, 400);
    }

    await saveConfig(store, next);
    return new Response(null, { status: 303, headers: { Location: "/panel" } });
  }

  const sub = url.pathname.match(/^\/api\/sub\/(xray|singbox|clash|base64)$/);
  if (sub) {
    if (!(await isAuthenticated(request, store))) return json({ error: "unauthorized" }, 401);
    const config = await getConfig(store);

    if (sub[1] === "base64") {
      return new Response(uriSubscription(config), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": "inline; filename=donagate.txt",
        },
      });
    }

    const format = sub[1] as "xray" | "singbox" | "clash";
    const body = generateSubscription(config, format);
    const contentType = format === "clash"
      ? "text/yaml; charset=utf-8"
      : "application/json; charset=utf-8";

    return new Response(body, { headers: { "Content-Type": contentType } });
  }

  return new Response("Not Found", { status: 404 });
}
