import type { ItemReader } from "./item-reader.interface.js";

export interface PeekableItemReader<T> extends ItemReader<T> {
  peek(): Promise<T | null>;
}
