/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
