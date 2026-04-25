import assert from "node:assert/strict";

import type { FieldExtractor } from "./field-extractor.interface.js";
import type { LineAggregator } from "./line-aggregator.js";
import { PassThroughFieldExtractor } from "./pass-through-field-extractor.js";

export abstract class ExtractorLineAggregator<T> implements LineAggregator<T> {
  private _fieldExtractor: FieldExtractor<T> =
    new PassThroughFieldExtractor<T>();

  setFieldExtractor(fieldExtractor: FieldExtractor<T>): void {
    this._fieldExtractor = fieldExtractor;
  }

  aggregate(item: T): string {
    assert.ok(item != null, "Item is required");
    const fields = this._fieldExtractor.extract(item);
    //
    // Replace nulls with empty strings
    //
    const args: unknown[] = Array.from({ length: fields.length });
    for (let i = 0; i < fields.length; i += 1) {
      if (fields[i] == null) {
        args[i] = "";
      } else {
        args[i] = fields[i];
      }
    }

    return this.doAggregate(args);
  }

  protected abstract doAggregate(fields: unknown[]): string;
}
