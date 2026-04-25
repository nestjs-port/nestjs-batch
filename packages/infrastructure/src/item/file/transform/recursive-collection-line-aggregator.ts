import assert from "node:assert/strict";
import { EOL } from "node:os";

import type { LineAggregator } from "./line-aggregator.js";
import { PassThroughLineAggregator } from "./pass-through-line-aggregator.js";

export class RecursiveCollectionLineAggregator<T> implements LineAggregator<
  Iterable<T>
> {
  private _lineSeparator = EOL;
  private _delegate: LineAggregator<T> = new PassThroughLineAggregator<T>();

  setDelegate(delegate: LineAggregator<T>): void {
    this._delegate = delegate;
  }

  setLineSeparator(lineSeparator: string): void {
    assert(lineSeparator != null, "The line separator must not be null");
    this._lineSeparator = lineSeparator;
  }

  aggregate(items: Iterable<T>): string {
    const aggregatedItems: string[] = [];
    for (const value of items) {
      aggregatedItems.push(this._delegate.aggregate(value));
    }

    return aggregatedItems.join(this._lineSeparator);
  }
}
