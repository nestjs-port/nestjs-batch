import type { LineAggregator } from "./line-aggregator.js";

export class PassThroughLineAggregator<T> implements LineAggregator<T> {
  aggregate(item: T): string {
    return String(item);
  }
}
