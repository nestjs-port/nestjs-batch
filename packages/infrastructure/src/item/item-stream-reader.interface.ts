import type { ItemReader } from "./item-reader.interface";
import type { ItemStream } from "./item-stream.interface";

// Convenience interface that combines ItemStream and ItemReader.
export interface ItemStreamReader<T> extends ItemStream, ItemReader<T> {}
