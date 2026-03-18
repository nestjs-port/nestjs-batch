export abstract class Writer {
  abstract write(str: string): void;

  abstract flush(): void;

  abstract close(): void;

  append(str: string): this {
    this.write(str);
    return this;
  }

  static nullWriter(): Writer {
    return new NullWriter();
  }
}

class NullWriter extends Writer {
  private _closed = false;

  private ensureOpen(): void {
    if (this._closed) {
      throw new Error("Stream closed");
    }
  }

  write(_str: string): void {
    this.ensureOpen();
  }

  flush(): void {
    this.ensureOpen();
  }

  close(): void {
    this._closed = true;
  }

  override append(_str: string): this {
    this.ensureOpen();
    return this;
  }
}
