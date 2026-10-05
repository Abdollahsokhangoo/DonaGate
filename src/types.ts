export type Protocol = "vless" | "trojan";
export type Network = "ws" | "tcp";
export type SubscriptionFormat = "xray" | "singbox" | "clash";

export interface AppConfig {
  panelPassword: string;
  publicHost: string;
  port: number;
  protocol: Protocol;
  network: Network;
  path: string;
  sni: string;
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
