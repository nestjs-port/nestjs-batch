import type { ItemReader } from "./item-reader.interface";

export interface PeekableItemReader<T> extends ItemReader<T> {
	peek(): Promise<T | null>;
}
