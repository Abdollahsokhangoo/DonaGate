import { getHealth } from "../services/health.ts";
import { json } from "../utils/response.ts";

export function healthRoute(): Response { return json(getHealth()); }
