export interface FieldExtractor<T> {
  extract(item: T): unknown[];
}
