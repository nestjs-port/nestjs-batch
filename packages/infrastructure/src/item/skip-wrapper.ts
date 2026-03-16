export class SkipWrapper<T> {
  private readonly _exception: unknown | null;
  private readonly _item: T;

  constructor(item: T, exception: unknown | null = null) {
    this._item = item;
    this._exception = exception;
  }

  get exception(): unknown | null {
    return this._exception;
  }

  get item(): T {
    return this._item;
  }
}
