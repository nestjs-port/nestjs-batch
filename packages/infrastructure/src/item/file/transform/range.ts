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
