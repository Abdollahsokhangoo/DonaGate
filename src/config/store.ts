import { defaultConfig } from "./defaults.ts";
import type { AppConfig, Storage } from "../types.ts";

const KEY = "config";

export async function getConfig(store: Storage): Promise<AppConfig> {
  const saved = await store.get<AppConfig>(KEY);
  return saved ? { ...defaultConfig, ...saved } : defaultConfig;
}

export async function saveConfig(store: Storage, config: AppConfig): Promise<void> {
  await store.set(KEY, config);
}
