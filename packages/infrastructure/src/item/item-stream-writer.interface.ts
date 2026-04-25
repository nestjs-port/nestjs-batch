import type { ItemStream } from "./item-stream.interface.js";
import type { ItemWriter } from "./item-writer.interface.js";

// Convenience interface that combines ItemStream and ItemWriter.
export interface ItemStreamWriter<T> extends ItemStream, ItemWriter<T> {}
