import { getConfig } from "./config.ts";
import { router } from "./router.ts";

const config = getConfig();
Deno.serve({ hostname: config.host, port: config.port }, async (request) => {
  try { return await router(request); }
  catch (error) { console.error(error); return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "content-type": "application/json" } }); }
});
console.log(`Donagate listening on ${config.host}:${config.port}`);
