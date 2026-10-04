import { html } from "../utils/response.ts";

export function panelRoute(adminPath: string): Response {
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Donagate Panel</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#eee;font-family:system-ui}main{width:min(680px,calc(100% - 40px));padding:32px;border:1px solid #27314d;border-radius:18px;background:#11182b}a{color:#9cc9ff}code{color:#9cc9ff}</style></head><body><main><h1>Donagate</h1><p>Deno-native foundation is running.</p><p>Admin path: <code>${adminPath}</code></p><p><a href="/api/health">API health</a></p></main></body></html>`);
}
