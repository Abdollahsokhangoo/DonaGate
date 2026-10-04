export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

export class MemoryStore implements KeyValueStore {
  #data = new Map<string, unknown>();
  async get<T>(key: string): Promise<T | null> { return (this.#data.get(key) as T | undefined) ?? null; }
  async set<T>(key: string, value: T): Promise<void> { this.#data.set(key, value); }
  async delete(key: string): Promise<void> { this.#data.delete(key); }
}
