import type { HealthResponse } from "../types.ts";

export function getHealth(): HealthResponse {
  return { status: "ok", service: "donagate", version: "0.1.0" };
}
