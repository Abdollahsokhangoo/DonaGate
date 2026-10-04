export type Protocol = "vless" | "trojan";
export type SubscriptionFormat = "xray" | "singbox" | "clash";

export interface AppConfig {
  panelPath: string;
  panelPassword: string;
  publicHost: string;
  port: number;
  protocol: Protocol;
  uuid: string;
  trojanPassword: string;
}

export interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface Storage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}
