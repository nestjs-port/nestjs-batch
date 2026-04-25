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

import { AbstractLineTokenizer } from "./abstract-line-tokenizer.js";
import { IncorrectLineLengthException } from "./incorrect-line-length-exception.js";
import type { Range } from "./range.js";

export class FixedLengthTokenizer extends AbstractLineTokenizer {
  private _ranges: Range[] = [];

  private _maxRange = 0;

  private _open = false;

  constructor(...ranges: Range[]) {
    super();
    this._ranges = [...ranges];
    this.calculateMaxRange(ranges);
  }

  setColumns(...ranges: Range[]): void {
    this._ranges = [...ranges];
    this.calculateMaxRange(ranges);
  }

  protected doTokenize(line: string): string[] {
    const tokens: string[] = [];
    const lineLength = line.length;

    if (lineLength < this._maxRange && this.isStrict()) {
      throw new IncorrectLineLengthException(
        `Line is shorter than max range ${this._maxRange}`,
        this._maxRange,
        lineLength,
        line,
      );
    }

    if (!this._open && lineLength > this._maxRange && this.isStrict()) {
      throw new IncorrectLineLengthException(
        `Line is longer than max range ${this._maxRange}`,
        this._maxRange,
        lineLength,
        line,
      );
    }

    for (const range of this._ranges) {
      const startPos = range.min - 1;
      const endPos = range.max;

      if (lineLength >= endPos) {
        tokens.push(line.substring(startPos, endPos));
      } else if (lineLength >= startPos) {
        tokens.push(line.substring(startPos));
      } else {
        tokens.push("");
      }
    }

    return tokens;
  }

  private calculateMaxRange(ranges: Range[]): void {
    if (ranges.length === 0) {
      this._maxRange = 0;
      return;
    }

    this._open = false;
    this._maxRange = ranges[0].min;

    for (const range of ranges) {
      let upperBound: number;
      if (range.hasMaxValue()) {
        upperBound = range.max;
      } else {
        upperBound = range.min;
        if (upperBound > this._maxRange) {
          this._open = true;
        }
      }

      if (upperBound > this._maxRange) {
        this._maxRange = upperBound;
      }
    }
  }
}
