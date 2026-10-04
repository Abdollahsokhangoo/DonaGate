import { route } from "./router.ts";
import { MemoryStore, KvStore } from "./services/storage.ts";
import { withCors } from "./middleware/cors.ts";

const store = Deno.env.get("DONAGATE_USE_KV") === "true" ? new KvStore(await Deno.openKv()) : new MemoryStore();
const port = Number(Deno.env.get("PORT") ?? 8000);

console.log(`Donagate 0.2.0 listening on :${port}`);
Deno.serve({ port }, async (request) => {
  try { return withCors(await route(request, store)); }
  catch (error) { console.error(error); return new Response("Internal Server Error", { status: 500 }); }
});
