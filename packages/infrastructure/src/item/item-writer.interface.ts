import type { Chunk } from "./chunk.js";

export interface ItemWriter<T> {
  write(chunk: Chunk<T>): Promise<void>;
}
