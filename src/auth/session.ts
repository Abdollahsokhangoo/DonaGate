import type { Session, Storage } from "../types.ts";

const SESSION_TTL = 1000 * 60 * 60 * 12;
const cookieName = "donagate_session";

export function getSessionToken(request: Request): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  for (const item of cookies.split(";")) {
    const [key, ...rest] = item.trim().split("=");
    if (key === cookieName) return rest.join("=") || null;
  }
  return null;
}

export async function createSession(store: Storage): Promise<Response> {
  const token = crypto.randomUUID();
  const session: Session = { token, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL };
  await store.set(`session:${token}`, session);
  return new Response(null, {
    status: 303,
    headers: { "Location": "/panel", "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL / 1000}` },
  });
}

export async function isAuthenticated(request: Request, store: Storage): Promise<boolean> {
  const token = getSessionToken(request);
  if (!token) return false;
  const session = await store.get<Session>(`session:${token}`);
  if (!session || session.expiresAt < Date.now()) return false;
  return true;
}

export async function logout(request: Request, store: Storage): Promise<Response> {
  const token = getSessionToken(request);
  if (token) await store.delete(`session:${token}`);
  return new Response(null, { status: 303, headers: { "Location": "/", "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Max-Age=0` } });
}
