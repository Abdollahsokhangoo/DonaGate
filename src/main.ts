import { route } from "./router.ts";
import { MemoryStore, KvStore } from "./services/storage.ts";
import { withCors } from "./middleware/cors.ts";

const useKv = Deno.env.get("DONAGATE_USE_KV") === "true";
const store = useKv ? new KvStore(await Deno.openKv()) : new MemoryStore();
const storageKind = useKv ? "kv" : "memory";
const port = Number(Deno.env.get("PORT") ?? 8000);

console.log(`Donagate 0.3.0 listening on :${port} (storage=${storageKind})`);

Deno.serve({ port }, async (request) => {
  try {
    return withCors(await route(request, store, storageKind));
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
