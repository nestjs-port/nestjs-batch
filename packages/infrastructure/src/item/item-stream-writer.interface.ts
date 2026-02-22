import type { ItemStream } from "./item-stream.interface";
import type { ItemWriter } from "./item-writer.interface";

// Convenience interface that combines ItemStream and ItemWriter.
export interface ItemStreamWriter<T> extends ItemStream, ItemWriter<T> {}
