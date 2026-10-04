import { createSession } from "./session.ts";
import { getConfig } from "../config/store.ts";
import type { Storage } from "../types.ts";

export async function login(request: Request, store: Storage): Promise<Response> {
  const config = await getConfig(store);
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  if (password !== config.panelPassword) {
    return new Response(loginPage("رمز عبور اشتباه است."), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  return createSession(store);
}

export function loginPage(error = ""): string {
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Donagate Login</title><style>body{font-family:sans-serif;max-width:420px;margin:80px auto;padding:20px}input,button{width:100%;padding:12px;margin:8px 0;box-sizing:border-box}button{cursor:pointer}.err{color:#b00020}</style></head><body><h1>ورود به Donagate</h1>${error ? `<p class="err">${error}</p>` : ""}<form method="post"><input type="password" name="password" placeholder="رمز پنل" required><button>ورود</button></form></body></html>`;
}
