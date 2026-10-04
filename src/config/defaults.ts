import type { AppConfig } from "../types.ts";

export const defaultConfig: AppConfig = {
  panelPath: "panel",
  panelPassword: "change-me",
  publicHost: "example.com",
  port: 443,
  protocol: "vless",
  uuid: crypto.randomUUID(),
  trojanPassword: "change-me",
};
