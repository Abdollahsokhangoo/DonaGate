export interface AppConfig {
  host: string;
  port: number;
  adminPath: string;
  sessionSecret: string;
}

export function getConfig(): AppConfig {
  return {
    host: Deno.env.get("DONAGATE_HOST") ?? "0.0.0.0",
    port: Number(Deno.env.get("DONAGATE_PORT") ?? "8000"),
    adminPath: Deno.env.get("DONAGATE_ADMIN_PATH") ?? "/admin",
    sessionSecret: Deno.env.get("DONAGATE_SESSION_SECRET") ?? "development-only-secret"
  };
}
