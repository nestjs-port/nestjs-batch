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

export class Range {
  static readonly UPPER_BORDER_NOT_DEFINED = 2147483647;

  private readonly _min: number;
  private readonly _max: number;

  constructor(min: number, max = Range.UPPER_BORDER_NOT_DEFINED) {
    this.checkMinMaxValues(min, max);
    this._min = min;
    this._max = max;
  }

  get max(): number {
    return this._max;
  }

  get min(): number {
    return this._min;
  }

  hasMaxValue(): boolean {
    return this._max !== Range.UPPER_BORDER_NOT_DEFINED;
  }

  private checkMinMaxValues(min: number, max: number): void {
    assert.ok(min > 0, "Min value must be higher than zero");
    assert.ok(min <= max, "Min value should be lower or equal to max value");
  }
}
