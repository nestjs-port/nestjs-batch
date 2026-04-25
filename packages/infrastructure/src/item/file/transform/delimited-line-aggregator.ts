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

import { ExtractorLineAggregator } from "./extractor-line-aggregator.js";

export class DelimitedLineAggregator<T> extends ExtractorLineAggregator<T> {
  private _delimiter = ",";

  private _quoteCharacter = "";

  setDelimiter(delimiter: string): void {
    this._delimiter = delimiter;
  }

  setQuoteCharacter(quoteCharacter: string): void {
    this._quoteCharacter = quoteCharacter;
  }

  protected doAggregate(fields: unknown[]): string {
    return fields
      .map((field) => `${this._quoteCharacter}${field}${this._quoteCharacter}`)
      .join(this._delimiter);
  }
}
