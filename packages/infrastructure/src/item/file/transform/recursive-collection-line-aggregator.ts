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
