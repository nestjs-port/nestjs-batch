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
