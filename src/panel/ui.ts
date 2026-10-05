import type { AppConfig } from "../types.ts";
import { vlessUri, trojanUri } from "../subscriptions/generators.ts";

function esc(v: string): string {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function panelPage(c: AppConfig, storageKind: "memory" | "kv"): string {
  const currentUri = c.protocol === "vless" ? vlessUri(c) : trojanUri(c);

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Donagate Panel</title>
  <style>
    :root { --bg:#f0f2f5; --card:#fff; --primary:#2563eb; --border:#e5e7eb; --text:#111; --muted:#6b7280; }
    *{box-sizing:border-box}
    body{font-family:system-ui,sans-serif;max-width:960px;margin:24px auto;padding:16px;background:var(--bg);color:var(--text)}
    h1{margin:0 0 4px;font-size:1.5rem}
    .sub{color:var(--muted);margin:0 0 20px;font-size:.9rem}
    .card{background:var(--card);padding:20px;border-radius:14px;margin:14px 0;border:1px solid var(--border)}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    label{display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--muted)}
    input,select{padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:.95rem;width:100%}
    button,.btn{display:inline-block;padding:10px 16px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-weight:600;text-decoration:none;font-size:.9rem}
    button.secondary{background:#e5e7eb;color:#111}
    .links a{margin-left:10px}
    code,pre{word-break:break-all;background:#f8fafc;padding:10px;border-radius:8px;display:block;font-size:.8rem;border:1px solid var(--border);direction:ltr;text-align:left}
    .badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:.75rem;background:#dbeafe;color:#1e40af}
    @media(max-width:650px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <h1>Donagate <span class="badge">v0.3</span></h1>
  <p class="sub">Storage: <strong>${storageKind === "kv" ? "Deno KV" : "Memory"}</strong> · پنل مدیریت</p>

  <div class="card">
    <h2>تنظیمات</h2>
    <form method="post" action="/api/config">
      <div class="grid">
        <label>Public Host<input name="publicHost" value="${esc(c.publicHost)}" required></label>
        <label>Port<input name="port" type="number" min="1" max="65535" value="${c.port}" required></label>
        <label>Protocol
          <select name="protocol">
            <option value="vless" ${c.protocol === "vless" ? "selected" : ""}>vless</option>
            <option value="trojan" ${c.protocol === "trojan" ? "selected" : ""}>trojan</option>
          </select>
        </label>
        <label>Network
          <select name="network">
            <option value="ws" ${c.network === "ws" ? "selected" : ""}>ws</option>
            <option value="tcp" ${c.network === "tcp" ? "selected" : ""}>tcp</option>
          </select>
        </label>
        <label>Path (WebSocket)<input name="path" value="${esc(c.path)}"></label>
        <label>SNI<input name="sni" value="${esc(c.sni)}"></label>
        <label>UUID<input name="uuid" value="${esc(c.uuid)}" required></label>
        <label>Trojan Password<input name="trojanPassword" value="${esc(c.trojanPassword)}"></label>
        <label>Panel Password<input name="panelPassword" value="${esc(c.panelPassword)}" required></label>
      </div>
      <p style="margin-top:16px"><button type="submit">ذخیره تنظیمات</button></p>
    </form>
  </div>

  <div class="card">
    <h2>Subscription Links</h2>
    <p class="links">
      <a class="btn" href="/api/sub/xray">Xray</a>
      <a class="btn" href="/api/sub/singbox">Sing-box</a>
      <a class="btn" href="/api/sub/clash">Clash / Mihomo</a>
      <a class="btn" href="/api/sub/base64">Base64 URI</a>
    </p>
    <p style="margin-top:14px;color:var(--muted);font-size:.85rem">URI فعلی:</p>
    <pre id="uri">${esc(currentUri)}</pre>
  </div>

  <div class="card">
    <form method="post" action="/logout">
      <button type="submit" class="secondary">خروج</button>
    </form>
  </div>
</body>
</html>`;
}
