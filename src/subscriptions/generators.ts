import type { AppConfig } from "../types.ts";

function qs(params: Record<string, string | undefined>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
    .join("&");
}

export function vlessUri(c: AppConfig): string {
  const isWs = c.network === "ws";
  const query = qs({
    encryption: "none",
    security: c.port === 443 || c.sni ? "tls" : "none",
    type: c.network,
    path: isWs ? c.path : undefined,
    host: isWs ? c.publicHost : undefined,
    sni: c.sni || undefined,
    fp: "chrome",
  });
  return `vless://${c.uuid}@${c.publicHost}:${c.port}?${query}#Donagate-VLESS`;
}

export function trojanUri(c: AppConfig): string {
  const isWs = c.network === "ws";
  const query = qs({
    security: "tls",
    type: c.network,
    path: isWs ? c.path : undefined,
    host: isWs ? c.publicHost : undefined,
    sni: c.sni || c.publicHost,
    fp: "chrome",
  });
  return `trojan://${encodeURIComponent(c.trojanPassword)}@${c.publicHost}:${c.port}?${query}#Donagate-Trojan`;
}

export function generateSubscription(c: AppConfig, format: "xray" | "singbox" | "clash"): string {
  const isWs = c.network === "ws";
  const useTls = c.port === 443 || !!c.sni;

  if (format === "xray") {
    const streamSettings: Record<string, unknown> = {
      network: c.network,
      security: useTls ? "tls" : "none",
    };
    if (useTls) {
      streamSettings.tlsSettings = {
        serverName: c.sni || c.publicHost,
        fingerprint: "chrome",
      };
    }
    if (isWs) {
      streamSettings.wsSettings = {
        path: c.path,
        headers: { Host: c.publicHost },
      };
    }

    const outbound =
      c.protocol === "vless"
        ? {
            protocol: "vless",
            settings: {
              vnext: [
                {
                  address: c.publicHost,
                  port: c.port,
                  users: [{ id: c.uuid, encryption: "none" }],
                },
              ],
            },
            streamSettings,
          }
        : {
            protocol: "trojan",
            settings: {
              servers: [
                {
                  address: c.publicHost,
                  port: c.port,
                  password: c.trojanPassword,
                },
              ],
            },
            streamSettings,
          };

    return JSON.stringify({ version: 2, outbounds: [outbound] }, null, 2);
  }

  if (format === "singbox") {
    const outbound: Record<string, unknown> = {
      type: c.protocol,
      tag: "donagate",
      server: c.publicHost,
      server_port: c.port,
      ...(c.protocol === "vless" ? { uuid: c.uuid } : { password: c.trojanPassword }),
      tls: {
        enabled: useTls,
        server_name: c.sni || c.publicHost,
        utls: { enabled: true, fingerprint: "chrome" },
      },
    };
    if (isWs) {
      outbound.transport = {
        type: "ws",
        path: c.path,
        headers: { Host: c.publicHost },
      };
    }
    return JSON.stringify({ outbounds: [outbound] }, null, 2);
  }

  // clash / mihomo
  const lines = [
    "proxies:",
    `  - name: Donagate`,
    `    type: ${c.protocol}`,
    `    server: ${c.publicHost}`,
    `    port: ${c.port}`,
  ];
  if (c.protocol === "vless") {
    lines.push(`    uuid: ${c.uuid}`);
    lines.push(`    udp: true`);
  } else {
    lines.push(`    password: ${c.trojanPassword}`);
  }
  lines.push(`    network: ${c.network}`);
  if (isWs) {
    lines.push(`    ws-opts:`);
    lines.push(`      path: ${c.path}`);
    lines.push(`      headers:`);
    lines.push(`        Host: ${c.publicHost}`);
  }
  if (useTls) {
    lines.push(`    tls: true`);
    lines.push(`    servername: ${c.sni || c.publicHost}`);
    lines.push(`    client-fingerprint: chrome`);
  }
  return lines.join("\n") + "\n";
}

export function uriSubscription(c: AppConfig): string {
  const uri = c.protocol === "vless" ? vlessUri(c) : trojanUri(c);
  return btoa(uri);
}
