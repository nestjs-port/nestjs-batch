import { AbstractLineTokenizer } from "./abstract-line-tokenizer";
import { IncorrectLineLengthException } from "./incorrect-line-length-exception";
import { Range } from "./range";

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
