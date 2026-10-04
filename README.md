# Donagate v0.2.0

Deno-native control-panel foundation inspired by the functional goals of BPB-Worker-Panel, implemented independently rather than copying its Cloudflare Worker runtime.

## Included
- Deno.serve HTTP server
- Password login + cookie session
- MemoryStore and optional Deno KV storage
- Config management for host/port/protocol/UUID/password
- Xray, Sing-box and Clash/Mihomo-style subscription generation
- Base64 URI subscription
- Basic panel UI
- Health endpoint
- Tests

## Local run

```bash
deno task check
deno task test
deno task dev
```

Open `http://localhost:8000/login`.

Default panel password: `change-me`.

For Deno KV locally/deployed, set `DONAGATE_USE_KV=true` and run with the required KV permission/flag for your installed Deno version. Deno Deploy's current platform supports Deno KV as a database option and applications access it through `Deno.openKv()`. See Deno's current deployment documentation.

## Important
This is the v0.2 foundation. WebSocket proxying, Warp, Fragment, Chain Proxy, Telegram integration and advanced routing are intentionally not included yet. They should be added only after the configuration/auth/storage core is stable.
