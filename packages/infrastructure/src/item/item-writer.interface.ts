import type { Chunk } from "./chunk";

export interface ItemWriter<T> {
  write(chunk: Chunk<T>): Promise<void>;
}
