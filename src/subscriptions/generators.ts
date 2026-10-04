import type { AppConfig } from "../types.ts";

export function vlessUri(c: AppConfig): string {
  const security = c.port === 443 ? "&security=tls" : "";
  return `vless://${c.uuid}@${c.publicHost}:${c.port}?encryption=none&type=tcp${security}#Donagate-VLESS`;
}

export function trojanUri(c: AppConfig): string {
  return `trojan://${encodeURIComponent(c.trojanPassword)}@${c.publicHost}:${c.port}?type=tcp&security=tls#Donagate-Trojan`;
}

export function generateSubscription(c: AppConfig, format: "xray" | "singbox" | "clash"): string {
  const uri = c.protocol === "vless" ? vlessUri(c) : trojanUri(c);
  if (format === "xray") return JSON.stringify({ version: 2, outbounds: [{ protocol: c.protocol, settings: c.protocol === "vless" ? { vnext: [{ address: c.publicHost, port: c.port, users: [{ id: c.uuid, encryption: "none" }] }] } : { servers: [{ address: c.publicHost, port: c.port, password: c.trojanPassword }] } }] }, null, 2);
  if (format === "singbox") return JSON.stringify({ outbounds: [{ type: c.protocol, server: c.publicHost, server_port: c.port, ...(c.protocol === "vless" ? { uuid: c.uuid } : { password: c.trojanPassword }), tls: { enabled: c.port === 443, server_name: c.publicHost } }] }, null, 2);
  return `proxies:\n  - name: Donagate\n    type: ${c.protocol}\n    server: ${c.publicHost}\n    port: ${c.port}\n    ${c.protocol === "vless" ? `uuid: ${c.uuid}\n    udp: true` : `password: ${c.trojanPassword}`}\n`;
}

export function uriSubscription(c: AppConfig): string { return uriToBase64(c.protocol === "vless" ? vlessUri(c) : trojanUri(c)); }
function uriToBase64(value: string): string { return btoa(value); }
