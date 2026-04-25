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
