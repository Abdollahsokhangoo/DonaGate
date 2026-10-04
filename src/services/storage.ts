import type { Storage } from "../types.ts";

export class MemoryStore implements Storage {
  #data = new Map<string, unknown>();
  async get<T>(key: string): Promise<T | null> {
    return (this.#data.get(key) as T | undefined) ?? null;
  }
  async set<T>(key: string, value: T): Promise<void> {
    this.#data.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.#data.delete(key);
  }
}

export class KvStore implements Storage {
  constructor(private readonly kv: Deno.Kv) {}
  async get<T>(key: string): Promise<T | null> {
    return (await this.kv.get<T>(["donagate", key])).value ?? null;
  }
  async set<T>(key: string, value: T): Promise<void> {
    await this.kv.set(["donagate", key], value);
  }
  async delete(key: string): Promise<void> {
    await this.kv.delete(["donagate", key]);
  }
}
