import type { AppConfig } from "../types.ts";

export const defaultConfig: AppConfig = {
  panelPassword: "change-me",
  publicHost: "example.com",
  port: 443,
  protocol: "vless",
  network: "ws",
  path: "/ws",
  sni: "example.com",
  uuid: crypto.randomUUID(),
  trojanPassword: "change-me",
};
