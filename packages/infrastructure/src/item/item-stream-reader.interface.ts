import type { ItemReader } from "./item-reader.interface.js";
import type { ItemStream } from "./item-stream.interface.js";

// Convenience interface that combines ItemStream and ItemReader.
export interface ItemStreamReader<T> extends ItemStream, ItemReader<T> {}
