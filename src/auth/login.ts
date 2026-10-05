import { createSession } from "./session.ts";
import { getConfig } from "../config/store.ts";
import type { Storage } from "../types.ts";

export async function login(request: Request, store: Storage): Promise<Response> {
  const config = await getConfig(store);
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (password !== config.panelPassword) {
    return new Response(loginPage("رمز عبور اشتباه است."), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return createSession(store);
}

export function loginPage(error = ""): string {
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Donagate Login</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:420px;margin:80px auto;padding:20px;background:#f4f5f7}
    .card{background:#fff;padding:24px;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
    input,button{width:100%;padding:12px;margin:8px 0;box-sizing:border-box;border-radius:8px;border:1px solid #ddd}
    button{background:#2563eb;color:#fff;border:none;cursor:pointer;font-weight:600}
    button:hover{background:#1d4ed8}
    .err{color:#b00020;margin:0 0 12px}
    h1{margin-top:0;font-size:1.4rem}
  </style>
</head>
<body>
  <div class="card">
    <h1>ورود به Donagate</h1>
    ${error ? `<p class="err">${error}</p>` : ""}
    <form method="post">
      <input type="password" name="password" placeholder="رمز پنل" required autofocus>
      <button type="submit">ورود</button>
    </form>
  </div>
</body>
</html>`;
}
