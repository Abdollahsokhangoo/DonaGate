import { getConfig } from "./config.ts";
import { withCors } from "./middleware/cors.ts";
import { healthRoute } from "./routes/health.ts";
import { panelRoute } from "./routes/panel.ts";
import { notFound } from "./utils/response.ts";

export async function router(request: Request): Promise<Response> {
  const config = getConfig();
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return withCors(new Response(null, { status: 204 }));
  let response: Response;
  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/panel")) response = panelRoute(config.adminPath);
  else if (request.method === "GET" && url.pathname === "/api/health") response = healthRoute();
  else response = notFound();
  return withCors(response);
}
