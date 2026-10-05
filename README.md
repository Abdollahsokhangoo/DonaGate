# Donagate v0.3.0

Deno-native control-panel foundation inspired by the functional goals of BPB-Worker-Panel, implemented independently for the Deno runtime / Deno Deploy.

## What is included

- `Deno.serve` HTTP server
- Password login + HttpOnly cookie session (12h TTL)
- `MemoryStore` and optional Deno KV storage
- Config management: host, port, protocol, network (ws/tcp), path, sni, uuid, passwords
- Subscription generation:
  - Xray (with streamSettings / ws / tls)
  - Sing-box
  - Clash / Mihomo
  - Base64 URI
- Improved Persian RTL panel UI
- Health endpoint (`/api/health`)
- Basic tests + GitHub Actions CI

## Local run

```bash
deno task check
deno task test
deno task dev
```

Open `http://localhost:8000/login`.

Default panel password: `change-me`  
**Change it immediately after first login.**

### Deno KV

```bash
DONAGATE_USE_KV=true deno run --allow-net --allow-env --allow-read --unstable-kv src/main.ts
```

(Exact flags may vary by Deno version. On Deno Deploy, enable the KV database for the project.)

## Intentionally not included yet

- Real WebSocket / VLESS / Trojan **proxy core** (the part that actually tunnels traffic)
- Warp, Fragment, Chain Proxy
- Multi-user accounts / traffic limits / expiry
- Telegram bot
- Advanced routing / Clean IP / DoH

These should be added only after the panel + config + subscription layer is stable and tested on Deno Deploy.

## Project structure

```
src/
  auth/          login + session
  config/        defaults + store
  middleware/    cors
  panel/         HTML UI
  services/      storage adapters
  subscriptions/ URI + config generators
  utils/         response helpers
  main.ts        entrypoint
  router.ts      all routes
  types.ts       shared types
```

## Next recommended steps

1. Deploy to Deno Deploy and confirm panel + subscriptions work.
2. Design the WebSocket upgrade path and a minimal tunnel handler.
3. Implement protocol parsing (VLESS/Trojan) carefully and behind feature flags.
4. Add multi-user + quota only after the single-user proxy path is reliable.
