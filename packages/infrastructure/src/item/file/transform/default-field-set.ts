import assert from "node:assert/strict";

import { DateFormat, SimpleDateFormat } from "@nestjs-batch/commons";
import { StringUtils } from "@nestjs-port/core";

import type { FieldSet } from "./field-set.interface";

type DateFormatLike = DateFormat | string;

export class DefaultFieldSet implements FieldSet {
  private static readonly DEFAULT_DATE_PATTERN = "yyyy-MM-dd";

  private _dateFormat: DateFormat = DefaultFieldSet.createDateFormat(
    DefaultFieldSet.DEFAULT_DATE_PATTERN,
  );

  private _grouping: string | null = null;

  private _decimal: string | null = null;

  private readonly _tokens: Array<string | null>;

  private _names: string[] | null = null;

  private _nameIndexMap: Map<string, number> | null = null;

  constructor(tokens: Array<string | null> | null);
  constructor(
    tokens: Array<string | null> | null,
    dateFormat: DateFormatLike | null,
    numberFormat: Intl.NumberFormat | null,
  );
  constructor(tokens: Array<string | null>, names: string[]);
  constructor(
    tokens: Array<string | null>,
    names: string[],
    dateFormat: DateFormatLike | null,
    numberFormat: Intl.NumberFormat | null,
  );
  constructor(
    tokens: Array<string | null> | null,
    namesOrDateFormat: string[] | DateFormatLike | null = null,
    dateFormatOrNumberFormat: DateFormatLike | Intl.NumberFormat | null = null,
    numberFormat: Intl.NumberFormat | null = null,
  ) {
    if (Array.isArray(namesOrDateFormat)) {
      assert(tokens != null, "Tokens must not be null");
      const names = namesOrDateFormat;
      assert(names != null, "Names must not be null");

      if (tokens.length !== names.length) {
        throw new Error(
          `Field names must be same length as values: names=${JSON.stringify(names)}, values=${JSON.stringify(tokens)}`,
        );
      }

      this._tokens = [...tokens];
      this._names = [...names];
      this._nameIndexMap = new Map<string, number>();
      for (let i = 0; i < names.length; i += 1) {
        this._nameIndexMap.set(names[i], i);
      }

      const resolvedDateFormat = DefaultFieldSet.isDateFormat(
        dateFormatOrNumberFormat,
      )
        ? dateFormatOrNumberFormat
        : DefaultFieldSet.DEFAULT_DATE_PATTERN;
      const resolvedNumberFormat =
        numberFormat ?? new Intl.NumberFormat("en-US");
      this.setDateFormat(resolvedDateFormat);
      this.setNumberFormat(resolvedNumberFormat);
      return;
    }

    this._tokens = tokens != null ? [...tokens] : [];

    const resolvedDateFormat =
      namesOrDateFormat ?? DefaultFieldSet.DEFAULT_DATE_PATTERN;
    const resolvedNumberFormat =
      (dateFormatOrNumberFormat as Intl.NumberFormat | null) ??
      new Intl.NumberFormat("en-US");
    this.setDateFormat(resolvedDateFormat);
    this.setNumberFormat(resolvedNumberFormat);
  }

  setDateFormat(dateFormat: DateFormatLike): void {
    this._dateFormat =
      typeof dateFormat === "string"
        ? DefaultFieldSet.createDateFormat(dateFormat)
        : dateFormat;
    this._dateFormat.lenient = false;
  }

  setNumberFormat(numberFormat: Intl.NumberFormat): void {
    const parts = numberFormat.formatToParts(12345.6);
    this._grouping = parts.find((part) => part.type === "group")?.value ?? ",";
    this._decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  }

  get names(): string[] {
    if (this._names == null) {
      throw new Error("Field names are not known");
    }
    return [...this._names];
  }

  hasNames(): boolean {
    return this._names != null;
  }

  get values(): string[] {
    return [...this._tokens] as string[];
  }

  readString(index: number): string | null;
  readString(name: string): string | null;
  readString(indexOrName: number | string): string | null {
    if (typeof indexOrName === "number") {
      return this.readAndTrim(indexOrName);
    }
    return this.readString(this.indexOf(indexOrName));
  }

  readRawString(index: number): string | null;
  readRawString(name: string): string | null;
  readRawString(indexOrName: number | string): string | null {
    const index =
      typeof indexOrName === "number" ? indexOrName : this.indexOf(indexOrName);
    this.ensureIndexInRange(index);
    return this._tokens[index];
  }

  readBoolean(index: number): boolean;
  readBoolean(name: string): boolean;
  readBoolean(index: number, trueValue: string): boolean;
  readBoolean(name: string, trueValue: string): boolean;
  readBoolean(indexOrName: number | string, trueValue = "true"): boolean {
    assert(trueValue != null, "'trueValue' cannot be null.");
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    return trueValue === value;
  }

  readChar(index: number): string;
  readChar(name: string): string;
  readChar(indexOrName: number | string): string {
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    assert(value != null, "Cannot convert null to char.");
    if (value.length !== 1) {
      throw new Error(`Cannot convert field value '${value}' to char.`);
    }
    return value.charAt(0);
  }

  readByte(index: number): number;
  readByte(name: string): number;
  readByte(indexOrName: number | string): number {
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    assert(value != null, "Cannot convert null to byte.");
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < -128 || parsed > 127) {
      throw new Error(`Unparseable byte: ${value}`);
    }
    return parsed;
  }

  readShort(index: number): number;
  readShort(name: string): number;
  readShort(indexOrName: number | string): number {
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    assert(value != null, "Cannot convert null to short.");
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < -32768 || parsed > 32767) {
      throw new Error(`Unparseable short: ${value}`);
    }
    return parsed;
  }

  readInt(index: number): number;
  readInt(name: string): number;
  readInt(index: number, defaultValue: number): number;
  readInt(name: string, defaultValue: number): number;
  readInt(indexOrName: number | string, defaultValue?: number): number {
    const index =
      typeof indexOrName === "number" ? indexOrName : this.indexOf(indexOrName);
    const value = this.readAndTrim(index);

    if (defaultValue !== undefined) {
      if (!this.hasLength(value)) {
        return defaultValue;
      }
      assert(value != null, "Cannot convert null to int.");
      return Number.parseInt(value, 10);
    }
    assert(value != null, "Cannot convert null to int.");
    return Math.trunc(this.parseNumber(value));
  }

  readLong(index: number): number;
  readLong(name: string): number;
  readLong(index: number, defaultValue: number): number;
  readLong(name: string, defaultValue: number): number;
  readLong(indexOrName: number | string, defaultValue?: number): number {
    const index =
      typeof indexOrName === "number" ? indexOrName : this.indexOf(indexOrName);
    const value = this.readAndTrim(index);

    if (defaultValue !== undefined) {
      if (!this.hasLength(value)) {
        return defaultValue;
      }
      assert(value != null, "Cannot convert null to long.");
      return Number.parseInt(value, 10);
    }
    assert(value != null, "Cannot convert null to long.");
    return Math.trunc(this.parseNumber(value));
  }

  readFloat(index: number): number;
  readFloat(name: string): number;
  readFloat(indexOrName: number | string): number {
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    assert(value != null, "Cannot convert null to float.");
    return this.parseNumber(value);
  }

  readDouble(index: number): number;
  readDouble(name: string): number;
  readDouble(indexOrName: number | string): number {
    const value =
      typeof indexOrName === "number"
        ? this.readAndTrim(indexOrName)
        : this.readAndTrim(this.indexOf(indexOrName));
    assert(value != null, "Cannot convert null to double.");
    return this.parseNumber(value);
  }

  readBigDecimal(index: number): number | null;
  readBigDecimal(name: string): number | null;
  readBigDecimal(index: number, defaultValue: number): number | null;
  readBigDecimal(name: string, defaultValue: number): number | null;
  readBigDecimal(
    indexOrName: number | string,
    defaultValue: number | null = null,
  ): number | null {
    if (typeof indexOrName === "string") {
      try {
        return this.readBigDecimalFromIndex(
          this.indexOf(indexOrName),
          defaultValue,
        );
      } catch (error) {
        throw new Error(
          `${this.toErrorMessage(error)}, name: [${indexOrName}]`,
        );
      }
    }
    return this.readBigDecimalFromIndex(indexOrName, defaultValue);
  }

  readDate(index: number): Date;
  readDate(name: string): Date;
  readDate(index: number, defaultValue: Date): Date;
  readDate(name: string, defaultValue: Date): Date;
  readDate(index: number, pattern: string): Date;
  readDate(name: string, pattern: string): Date;
  readDate(index: number, pattern: string, defaultValue: Date): Date;
  readDate(name: string, pattern: string, defaultValue: Date): Date;
  readDate(
    indexOrName: number | string,
    patternOrDefault?: string | Date | null,
    defaultValue?: Date | null,
  ): Date {
    const hasPatternOrDefault = patternOrDefault !== undefined;
    const hasDefaultValue = defaultValue !== undefined;

    if (typeof indexOrName === "string") {
      try {
        return this.readDateFromIndex(
          this.indexOf(indexOrName),
          patternOrDefault,
          defaultValue,
          hasPatternOrDefault,
          hasDefaultValue,
        );
      } catch (error) {
        throw new Error(
          `${this.toErrorMessage(error)}, name: [${indexOrName}]`,
        );
      }
    }
    return this.readDateFromIndex(
      indexOrName,
      patternOrDefault,
      defaultValue,
      hasPatternOrDefault,
      hasDefaultValue,
    );
  }

  get fieldCount(): number {
    return this._tokens.length;
  }

  get properties(): Record<string, string> {
    if (this._names == null) {
      throw new Error("Cannot create properties without meta data");
    }
    const properties: Record<string, string> = {};
    for (let i = 0; i < this._tokens.length; i += 1) {
      const value = this.readAndTrim(i);
      if (value != null) {
        properties[this._names[i]] = value;
      }
    }
    return properties;
  }

  protected readAndTrim(index: number): string | null {
    this.ensureIndexInRange(index);
    const value = this._tokens[index];
    return value != null ? value.trim() : null;
  }

  protected indexOf(name: string): number {
    if (this._nameIndexMap == null) {
      throw new Error("Cannot access columns by name without meta data");
    }
    const index = this._nameIndexMap.get(name);
    if (index != null) {
      return index;
    }
    throw new Error(`Cannot access column [${name}] from ${this._names}`);
  }

  private static isDateFormat(value: unknown): value is DateFormatLike {
    return typeof value === "string" || value instanceof DateFormat;
  }

  private static createDateFormat(pattern: string): SimpleDateFormat {
    const dateFormat = new SimpleDateFormat(pattern);
    dateFormat.lenient = false;
    return dateFormat;
  }

  private removeSeparators(candidate: string): string {
    const grouping = this._grouping ?? ",";
    const decimal = this._decimal ?? ".";
    return candidate.split(grouping).join("").replace(decimal, ".");
  }

  private parseNumber(input: string): number {
    if (!StringUtils.hasText(input)) {
      throw new Error(`Unparseable number: ${input}`);
    }
    const normalized = this.removeSeparators(input);
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Unparseable number: ${input}`);
    }
    return parsed;
  }

  private parseDate(input: string, dateFormat: DateFormat): Date {
    const pattern =
      dateFormat instanceof SimpleDateFormat
        ? dateFormat.toPattern()
        : String(dateFormat);

    try {
      return dateFormat.parse(input);
    } catch (error) {
      throw new Error(`${this.toErrorMessage(error)}, format: [${pattern}]`);
    }
  }

  private ensureIndexInRange(index: number): void {
    if (index < 0 || index >= this._tokens.length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }
  }

  private hasLength(value: string | null): boolean {
    return value != null && value.length > 0;
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private readBigDecimalFromIndex(
    index: number,
    defaultValue: number | null,
  ): number | null {
    const candidate = this.readAndTrim(index);
    if (!StringUtils.hasText(candidate)) {
      return defaultValue;
    }

    const parsed = Number(this.removeSeparators(candidate));
    if (!Number.isFinite(parsed)) {
      throw new Error(`Unparseable number: ${candidate}`);
    }
    return parsed;
  }

  private readDateFromIndex(
    index: number,
    patternOrDefault?: string | Date | null,
    defaultValue?: Date | null,
    hasPatternOrDefault = false,
    hasDefaultValue = false,
  ): Date {
    const candidate = this.readAndTrim(index);

    if (hasPatternOrDefault && typeof patternOrDefault !== "string") {
      if (!StringUtils.hasText(candidate)) {
        return patternOrDefault as Date;
      }
      assert(candidate != null, "Cannot convert null to date.");
      return this.parseDate(candidate, this._dateFormat);
    }

    if (typeof patternOrDefault === "string") {
      if (hasDefaultValue && !StringUtils.hasText(candidate)) {
        return defaultValue as Date;
      }
      assert(candidate != null, "Cannot convert null to date.");
      return this.parseDate(
        candidate,
        DefaultFieldSet.createDateFormat(patternOrDefault),
      );
    }

    assert(candidate != null, "Cannot convert null to date.");
    return this.parseDate(candidate, this._dateFormat);
  }
}
