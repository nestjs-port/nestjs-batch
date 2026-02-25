import type { LineAggregator } from "./line-aggregator";

export class PassThroughLineAggregator<T> implements LineAggregator<T> {
  aggregate(item: T): string {
    return String(item);
  }
}
