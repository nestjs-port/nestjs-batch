export abstract class DateFormat {
  static readonly FULL = 0;
  static readonly LONG = 1;
  static readonly MEDIUM = 2;
  static readonly SHORT = 3;
  static readonly DEFAULT = DateFormat.MEDIUM;

  static readonly ERA_FIELD = 0;
  static readonly YEAR_FIELD = 1;
  static readonly MONTH_FIELD = 2;
  static readonly DATE_FIELD = 3;
  static readonly HOUR_OF_DAY1_FIELD = 4;
  static readonly HOUR_OF_DAY0_FIELD = 5;
  static readonly MINUTE_FIELD = 6;
  static readonly SECOND_FIELD = 7;
  static readonly MILLISECOND_FIELD = 8;
  static readonly DAY_OF_WEEK_FIELD = 9;
  static readonly DAY_OF_YEAR_FIELD = 10;
  static readonly DAY_OF_WEEK_IN_MONTH_FIELD = 11;
  static readonly WEEK_OF_YEAR_FIELD = 12;
  static readonly WEEK_OF_MONTH_FIELD = 13;
  static readonly AM_PM_FIELD = 14;
  static readonly HOUR1_FIELD = 15;
  static readonly HOUR0_FIELD = 16;
  static readonly TIMEZONE_FIELD = 17;

  private _lenient = true;
  private _timeZone: string | undefined;

  abstract format(date: Date): string;

  abstract parse(source: string): Date;

  get lenient(): boolean {
    return this._lenient;
  }

  set lenient(value: boolean) {
    this._lenient = value;
  }

  get timeZone(): string | undefined {
    return this._timeZone;
  }

  set timeZone(value: string | undefined) {
    this._timeZone = value;
  }
}
