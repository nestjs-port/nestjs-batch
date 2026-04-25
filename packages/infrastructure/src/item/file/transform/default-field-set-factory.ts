import type { DateFormat } from "@nestjs-batch/commons";

import { DefaultFieldSet } from "./default-field-set.js";
import type { FieldSet } from "./field-set.interface.js";
import type { FieldSetFactory } from "./field-set-factory.interface.js";

export class DefaultFieldSetFactory implements FieldSetFactory {
  private _dateFormat: DateFormat | null = null;

  private _numberFormat: Intl.NumberFormat | null = null;

  constructor();
  constructor(dateFormat: DateFormat, numberFormat: Intl.NumberFormat);
  constructor(
    dateFormat: DateFormat | null = null,
    numberFormat: Intl.NumberFormat | null = null,
  ) {
    this._dateFormat = dateFormat;
    this._numberFormat = numberFormat;
  }

  setDateFormat(dateFormat: DateFormat): void {
    this._dateFormat = dateFormat;
  }

  setNumberFormat(numberFormat: Intl.NumberFormat): void {
    this._numberFormat = numberFormat;
  }

  create(values: string[], names: string[]): FieldSet;
  create(values: string[]): FieldSet;
  create(values: string[], names?: string[]): FieldSet {
    if (names != null) {
      return new DefaultFieldSet(
        values,
        names,
        this._dateFormat,
        this._numberFormat,
      );
    }
    return new DefaultFieldSet(values, this._dateFormat, this._numberFormat);
  }
}
