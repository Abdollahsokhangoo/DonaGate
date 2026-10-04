# Donagate v0.1.0

Deno-native foundation for the Donagate project.

## Run locally

```bash
deno task dev
```

Open `/` or `/panel`.

Health endpoint: `GET /api/health`

## Environment

- `DONAGATE_HOST` (default `0.0.0.0`)
- `DONAGATE_PORT` (default `8000`)
- `DONAGATE_ADMIN_PATH` (default `/admin`)
- `DONAGATE_SESSION_SECRET` (development placeholder)

The architecture intentionally avoids Cloudflare Workers-specific APIs.
