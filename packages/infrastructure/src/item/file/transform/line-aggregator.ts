export interface LineAggregator<T> {
  aggregate(item: T): string;
}
